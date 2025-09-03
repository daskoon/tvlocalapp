
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useTransition, useEffect } from "react"
import { Car, Tv2, Ruler, Sparkles, CheckCircle2, XCircle, LoaderCircle, Lightbulb, RotateCcw, Info, MessageSquareQuote, Star, HelpCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import useLocalStorage from "@/hooks/use-local-storage"
import { checkFit } from "@/lib/fit-calculator"
import type { Vehicle, VehicleDimensions, TvDimensions, LoadingScenario, FitResult } from "@/lib/types"
import { findVehicleDimensionsAction, getFitSuggestionsAction } from "@/app/actions"
import { cn } from "@/lib/utils"
import { TV_DATA, VEHICLE_DATA } from "@/lib/database"

const formSchema = z.object({
  // Vehicle DB
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.string(),
  // Vehicle AI lookup
  aiMake: z.string(),
  aiModel: z.string(),
  aiYear: z.string(),
  // Vehicle Manual dimensions
  vehicleLength: z.coerce.number().positive({ message: "Must be positive" }).optional(),
  vehicleWidth: z.coerce.number().positive({ message: "Must be positive" }).optional(),
  vehicleHeight: z.coerce.number().positive({ message: "Must be positive" }).optional(),
  // TV DB
  tvBrand: z.string(),
  tvSize: z.string(),
  // TV dimensions
  tvWidth: z.coerce.number().positive({ message: "Must be positive" }).optional(),
  tvHeight: z.coerce.number().positive({ message: "Must be positive" }).optional(),
  tvDepth: z.coerce.number().positive({ message: "Must be positive" }).optional(),
});

type Suggestions = {
  loadingSuggestions: { suggestions: string[] };
  tvSizeSuggestions: { suggestions: { tvWidth: number; tvHeight: number; tvDepth: number; reason: string }[] };
} | null;

type CompatibleVehicle = { name: string, scenario: string };

const ALL_VEHICLE_MAKES = [
  ...new Set(
    Object.values(VEHICLE_DATA.vehicle_models)
      .flatMap(category => Object.keys(category))
      .map(modelName => modelName.split(' ')[0])
  ),
].sort();

const getModelsForMake = (make: string) => {
  if (!make) return [];
  const models: { name: string; category: string }[] = [];
  for (const category in VEHICLE_DATA.vehicle_models) {
    for (const modelName in VEHICLE_DATA.vehicle_models[category as keyof typeof VEHICLE_DATA.vehicle_models]) {
      if (modelName.startsWith(make)) {
        models.push({ name: modelName, category: category });
      }
    }
  }
  return models.sort((a, b) => a.name.localeCompare(b.name));
};

const getYearsForModel = (category: string, model: string) => {
  const modelData = (VEHICLE_DATA.vehicle_models as any)[category]?.[model];
  if (!modelData || !modelData.year_range) return [];
  const [start, end] = modelData.year_range.split('-').map(Number);
  const years = [];
  for (let year = end; year >= start; year--) {
    years.push(year.toString());
  }
  return years;
}


export function CargoCalc() {
  const { toast } = useToast();
  const [isVehicleLoading, startVehicleTransition] = useTransition();
  const [isSuggestionLoading, startSuggestionTransition] = useTransition();
  const [isFinding, startFindingTransition] = useTransition();

  const [activeTab, setActiveTab] = useState('fit-check');
  const [fitResult, setFitResult] = useState<FitResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions>(null);
  const [compatibleTvSizes, setCompatibleTvSizes] = useState<string[] | null>(null);
  const [compatibleVehicles, setCompatibleVehicles] = useState<CompatibleVehicle[] | null>(null);
  
  const [vehicleInputMethod, setVehicleInputMethod] = useState('database');
  const [tvInputMethod, setTvInputMethod] = useState('database');

  const [availableTvSizes, setAvailableTvSizes] = useState<string[]>([]);
  const [availableVehicleModels, setAvailableVehicleModels] = useState<{name: string, category: string}[]>([]);
  const [availableVehicleYears, setAvailableVehicleYears] = useState<string[]>([]);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [hideFeedbackDialog, setHideFeedbackDialog] = useLocalStorage('hideFeedbackDialog', false);

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleMake: "", vehicleModel: "", vehicleYear: "",
      aiMake: "", aiModel: "", aiYear: "",
      tvBrand: "", tvSize: "",
    },
  });

  const { watch, setValue, reset, getValues } = form;
  const tvBrand = watch('tvBrand');
  const tvSize = watch('tvSize');
  const vehicleMake = watch('vehicleMake');
  const vehicleModel = watch('vehicleModel');

  // TV Brand -> TV Sizes
  useEffect(() => {
    if (tvBrand && TV_DATA.tv_brands[tvBrand as keyof typeof TV_DATA.tv_brands]) {
      const brandData = TV_DATA.tv_brands[tvBrand as keyof typeof TV_DATA.tv_brands];
      setAvailableTvSizes(brandData.available_sizes.sort((a,b) => parseInt(a) - parseInt(b)));
      setValue('tvSize', '');
    } else {
      setAvailableTvSizes([]);
    }
  }, [tvBrand, setValue]);

  // TV Size -> TV Dimensions
  useEffect(() => {
    if (tvInputMethod === 'database' && tvSize && TV_DATA.tv_box_dimensions[tvSize as keyof typeof TV_DATA.tv_box_dimensions]) {
      const dims = TV_DATA.tv_box_dimensions[tvSize as keyof typeof TV_DATA.tv_box_dimensions];
      setValue('tvWidth', dims.box_w);
      setValue('tvHeight', dims.box_h);
      setValue('tvDepth', dims.box_d);
    }
  }, [tvSize, tvInputMethod, setValue]);
  
  // Vehicle Make -> Vehicle Models
  useEffect(() => {
    setAvailableVehicleModels(getModelsForMake(vehicleMake));
    setValue('vehicleModel', '');
    setValue('vehicleYear', '');
  }, [vehicleMake, setValue]);

  // Vehicle Model -> Vehicle Years
  useEffect(() => {
     if (vehicleModel) {
      const [modelName, category] = vehicleModel.split('|');
      setAvailableVehicleYears(getYearsForModel(category, modelName));
    } else {
      setAvailableVehicleYears([]);
    }
    setValue('vehicleYear', '');
  }, [vehicleModel, setValue]);


  const handleAiDimensionLookup = async () => {
    const { aiMake, aiModel, aiYear } = form.getValues();
    if (!aiMake || !aiModel || !aiYear) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide the make, model, and year of your vehicle." });
      return;
    }
    startVehicleTransition(async () => {
      try {
        const result = await findVehicleDimensionsAction({ make: aiMake, model: aiModel, year: aiYear });
        if (result.error) {
          toast({ variant: "destructive", title: "Error", description: result.error });
        } else {
          form.setValue("vehicleLength", result.length);
          form.setValue("vehicleWidth", result.width);
          form.setValue("vehicleHeight", result.height);
          toast({ title: "Success", description: "Vehicle dimensions found and filled." });
        }
      } catch (error) {
        toast({ variant: "destructive", title: "AI Error", description: error instanceof Error ? error.message : "An unknown error occurred." });
      }
    });
  };

  const getVehicle = (): Vehicle | null => {
    switch (vehicleInputMethod) {
      case 'database':
        const { vehicleModel, vehicleYear } = form.getValues();
        if (vehicleModel && vehicleYear) {
          const [modelName, category] = vehicleModel.split('|');
          const modelData = (VEHICLE_DATA.vehicle_models as any)[category]?.[modelName];
          if (modelData) {
            return {
              ...modelData,
              name: `${modelData.year_range} ${modelName}`, // Add name for vehicle finder
            } as Vehicle;
          }
        }
        return null;
      case 'manual':
      case 'ai': {
        const { vehicleLength, vehicleWidth, vehicleHeight } = form.getValues();
        if(vehicleLength && vehicleWidth && vehicleHeight) {
          return {
            name: "Manual Dimensions",
            manual_dimensions: { length: vehicleLength, width: vehicleWidth, height: vehicleHeight }
          };
        }
        return null;
      }
      default:
        return null;
    }
  }

  const getTvDimensions = (): TvDimensions | null => {
     switch (tvInputMethod) {
      case 'database': {
        const { tvSize } = form.getValues();
        if(tvSize && TV_DATA.tv_box_dimensions[tvSize as keyof typeof TV_DATA.tv_box_dimensions]){
           const dims = TV_DATA.tv_box_dimensions[tvSize as keyof typeof TV_DATA.tv_box_dimensions];
           return { width: dims.box_w, height: dims.box_h, depth: dims.box_d };
        }
        return null;
      }
      case 'manual': {
        const { tvWidth, tvHeight, tvDepth } = form.getValues();
        if(tvWidth && tvHeight && tvDepth) {
          return { width: tvWidth, height: tvHeight, depth: tvDepth };
        }
        return null;
      }
      default:
        return null;
    }
  }


  const onCalculate = () => {
    setSuggestions(null);
    setFitResult(null); // Reset previous results
    const vehicle = getVehicle();
    const tvDimensions = getTvDimensions();

    if (!vehicle) {
      toast({ variant: "destructive", title: "Missing Vehicle Info", description: "Please select or enter complete vehicle information." });
      return;
    }
     if (!tvDimensions) {
      toast({ variant: "destructive", title: "Missing TV Info", description: "Please select or enter complete TV dimensions." });
      return;
    }

    const result = checkFit(vehicle, tvDimensions);
    setFitResult(result);
    
    if (!hideFeedbackDialog) {
        setTimeout(() => setIsFeedbackOpen(true), 1500);
    }
  };

  const onFindTvs = () => {
    setCompatibleTvSizes(null);
    const vehicle = getVehicle();
    if (!vehicle) {
        toast({ variant: "destructive", title: "Missing Vehicle Info", description: "Please select a vehicle to find compatible TVs." });
        return;
    }
    startFindingTransition(() => {
        const fittingSizes: string[] = [];
        const allTvSizes = Object.keys(TV_DATA.tv_box_dimensions);
        
        for (const size of allTvSizes) {
            const tvData = TV_DATA.tv_box_dimensions[size as keyof typeof TV_DATA.tv_box_dimensions];
            if (!tvData) continue;

            const tvDims: TvDimensions = {
                width: tvData.box_w,
                height: tvData.box_h,
                depth: tvData.box_d,
            };

            const result = checkFit(vehicle, tvDims);
            if (result.fits) {
                fittingSizes.push(size);
            }
        }
        const sortedSizes = fittingSizes.sort((a,b) => parseInt(a) - parseInt(b));
        setCompatibleTvSizes(sortedSizes);
    });
  };

  const scenarioLabels: Record<LoadingScenario, string> = {
    passthrough: 'Trunk (Passthrough)',
    seats_down: 'Cargo Area (Seats Down)',
    flatbed: 'Truck Bed',
    cargo: 'Cargo Area',
    manual: 'Manual Dimensions'
  };

  const onFindVehicles = () => {
    setCompatibleVehicles(null);
    const tvDims = getTvDimensions();
    if (!tvDims) {
      toast({ variant: "destructive", title: "Missing TV Info", description: "Please select a TV to find compatible vehicles." });
      return;
    }
    startFindingTransition(() => {
      const fittingVehicles: CompatibleVehicle[] = [];
      const allVehicleCategories = Object.keys(VEHICLE_DATA.vehicle_models);

      for (const category of allVehicleCategories) {
        const models = VEHICLE_DATA.vehicle_models[category as keyof typeof VEHICLE_DATA.vehicle_models];
        for (const modelName in models) {
          const vehicleData = models[modelName as keyof typeof models] as Vehicle;
          const result = checkFit(vehicleData, tvDims);
          if (result.fits && result.scenario) {
            fittingVehicles.push({ name: `${vehicleData.year_range} ${modelName}`, scenario: scenarioLabels[result.scenario] });
          }
        }
      }
      setCompatibleVehicles(fittingVehicles.sort((a,b) => a.name.localeCompare(b.name)));
    });
  };
  
  const getVehicleDimensionsForSuggestions = (): VehicleDimensions | null => {
      const vehicle = getVehicle();
      if (!vehicle) return null;
      
      if (vehicle.seats_down_l && vehicle.seats_down_w && vehicle.seats_down_h) {
          return { length: vehicle.seats_down_l, width: vehicle.seats_down_w, height: vehicle.seats_down_h };
      }
       if (vehicle.cargo_l && vehicle.cargo_w && vehicle.cargo_h) {
          return { length: vehicle.cargo_l, width: vehicle.cargo_w, height: vehicle.cargo_h };
      }
      if (vehicle.manual_dimensions) {
          return vehicle.manual_dimensions;
      }
      return null;
  }

  const handleGetSuggestions = () => {
    const vehicleDimensions = getVehicleDimensionsForSuggestions();
    const tvDimensions = getTvDimensions();
    if (!vehicleDimensions || !tvDimensions) {
       toast({ variant: "destructive", title: "Missing Info", description: "Cannot get suggestions without vehicle and TV dimensions." });
       return;
    }
    startSuggestionTransition(async () => {
      try {
        const result = await getFitSuggestionsAction({ vehicleDimensions, tvDimensions });
        setSuggestions(result);
      } catch (error) {
        toast({ variant: "destructive", title: "Suggestion Error", description: error instanceof Error ? error.message : "Could not fetch suggestions." });
      }
    });
  };
  
  const handleFeedbackSubmit = () => {
    const values = getValues();
    const vehicleName = values.vehicleMake && values.vehicleModel ? `${values.vehicleYear} ${values.vehicleMake} ${values.vehicleModel.split('|')[0]}` : 'Manual Vehicle';
    const tvName = values.tvBrand && values.tvSize ? `${values.tvBrand} ${values.tvSize}" TV` : 'Manual TV';
    const resultText = fitResult?.fits ? `Fit (${fitResult.scenario})` : 'Did not fit';

    const subject = `CargoCalc Feedback: ${vehicleName} & ${tvName}`;
    let body = `A user has submitted feedback for the CargoCalc app.\n\n`;
    body += `----- Details -----\n`;
    body += `Vehicle: ${vehicleName}\n`;
    body += `TV: ${tvName}\n`;
    body += `Result: ${resultText}\n\n`;
    body += `----- Feedback -----\n`;
    body += `How would you rate the app's usefulness?: ${feedbackRating > 0 ? `${feedbackRating}/5` : 'Not rated'}\n\n`;
    body += `How can we improve the app?:\n${feedbackComment || 'No comment provided.'}\n`;

    window.location.href = `mailto:Daskoon@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setIsFeedbackOpen(false);
    setFeedbackRating(0);
    setFeedbackComment("");
  };


  const handleReset = () => {
    reset();
    setFitResult(null);
    setSuggestions(null);
    setCompatibleTvSizes(null);
    setCompatibleVehicles(null);
    setAvailableTvSizes([]);
    setAvailableVehicleModels([]);
    setAvailableVehicleYears([]);
    setVehicleInputMethod('database');
    setTvInputMethod('database');
  }

  const vehicle = getVehicle();
  const tvDims = getTvDimensions();
  const isCalculateDisabled = !vehicle || !tvDims || (vehicleInputMethod === 'database' && !watch('vehicleYear'));
  const isFindTvsDisabled = !vehicle || (vehicleInputMethod === 'database' && !watch('vehicleYear'));
  const isFindVehiclesDisabled = !tvDims || (tvInputMethod === 'database' && !watch('tvSize'));
  

  const getResultStatus = () => {
    if (!fitResult) return null;
    if (fitResult.fits) {
        return fitResult.tight ? { text: 'Tight Fit', className: 'bg-yellow-500 text-black' } : { text: 'Confirmed Fit', className: 'bg-green-600 text-white' };
    }
    return { text: 'Will Not Fit', className: 'bg-destructive text-destructive-foreground' };
  }

  const renderTvForm = () => (
    <section className="form-section">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-accent">
          <h2 className="section-title text-lg font-semibold text-primary">Television Information</h2>
          <Popover>
            <PopoverTrigger asChild>
               <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              <p>Select the TV brand and size from the database, or enter the TV box dimensions manually. Box dimensions can usually be found on the packaging.</p>
            </PopoverContent>
          </Popover>
        </div>
        <Tabs value={tvInputMethod} onValueChange={setTvInputMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="database">Database Selection</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="database" className="pt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="tvBrand" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {Object.keys(TV_DATA.tv_brands).sort().map(brand => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="tvSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Screen Size</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={availableTvSizes.length === 0}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {availableTvSizes.map(size => <SelectItem key={size} value={size}>{size}"</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )} />
                </div>
            </TabsContent>
            <TabsContent value="manual" className="pt-6">
                <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="tvWidth" render={({ field }) => (<FormItem><FormLabel>Width (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tvHeight" render={({ field }) => (<FormItem><FormLabel>Height (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tvDepth" render={({ field }) => (<FormItem><FormLabel>Depth (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </TabsContent>
        </Tabs>
    </section>
  );
  
  const renderVehicleForm = () => (
      <section className="form-section">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-accent">
            <h2 className="section-title text-lg font-semibold text-primary">Vehicle Information</h2>
            <Popover>
              <PopoverTrigger asChild>
                 <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                 <p>Use the database for quick lookups. If the vehicle isn't listed, use "Manual" to enter cargo dimensions directly. The "AI Lookup" is experimental and may not be accurate.</p>
              </PopoverContent>
            </Popover>
          </div>
          <Tabs value={vehicleInputMethod} onValueChange={setVehicleInputMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="ai">AI Lookup</TabsTrigger>
              </TabsList>
              <TabsContent value="database" className="pt-6 space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                      <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Make</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger></FormControl>
                          <SelectContent>
                              {ALL_VEHICLE_MAKES.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
                          </SelectContent>
                          </Select>
                      </FormItem>
                      )} />
                      <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Model</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={availableVehicleModels.length === 0}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                          <SelectContent>
                              {availableVehicleModels.map(model => <SelectItem key={model.name} value={`${model.name}|${model.category}`}>{model.name}</SelectItem>)}
                          </SelectContent>
                          </Select>
                      </FormItem>
                      )} />
                      <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={availableVehicleYears.length === 0}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                          <SelectContent>
                              {availableVehicleYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                          </SelectContent>
                          </Select>
                      </FormItem>
                      )} />
                  </div>
              </TabsContent>
              <TabsContent value="manual" className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">Enter the dimensions of the available cargo space.</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                      <FormField control={form.control} name="vehicleWidth" render={({ field }) => (<FormItem><FormLabel>Width (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="vehicleHeight" render={({ field }) => (<FormItem><FormLabel>Height (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="vehicleLength" render={({ field }) => (<FormItem><FormLabel>Depth (in)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              </TabsContent>
              <TabsContent value="ai" className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">AI will attempt to find dimensions, but manual entry is more reliable. This feature is experimental.</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                      <FormField control={form.control} name="aiMake" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Toyota" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="aiModel" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Highlander" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="aiYear" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input placeholder="e.g., 2023" {...field} /></FormControl></FormItem>)} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">AI-retrieved dimensions will populate the fields in the 'Manual' tab for verification.</p>
                  <Button type="button" onClick={handleAiDimensionLookup} disabled={isVehicleLoading} className="w-full sm:w-auto">
                      {isVehicleLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles />} Find Dimensions
                  </Button>
              </TabsContent>
          </Tabs>
      </section>
  );

  return (
      <Form {...form}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="fit-check">Fit Check</TabsTrigger>
                <TabsTrigger value="tv-finder">TV Finder</TabsTrigger>
                <TabsTrigger value="vehicle-finder">Vehicle Finder</TabsTrigger>
            </TabsList>

            {/* FIT CHECK TAB */}
            <TabsContent value="fit-check">
              <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="grid md:grid-cols-2 gap-8 items-start">
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-card border rounded-lg shadow-sm p-6">
                        {renderTvForm()}
                        <div className="mt-8">
                          {renderVehicleForm()}
                        </div>
                        
                        <div className="action-buttons flex gap-4 mt-8 pt-6 border-t">
                            <Button type="submit" size="lg" className="flex-grow" disabled={isCalculateDisabled}>
                                <Ruler className="mr-2" />Check Fitment
                            </Button>
                            <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                                <RotateCcw className="mr-2" />Reset
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                  {fitResult && tvDims && (
                    <Card>
                        <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                            <CardTitle className="text-primary">Fitment Analysis</CardTitle>
                            <div className={cn("fitment-status px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider", getResultStatus()?.className)}>
                              {getResultStatus()?.text}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                            <div className="measurement-card bg-slate-50 p-4 rounded-lg border">
                                <div className="measurement-label text-xs uppercase font-semibold text-muted-foreground mb-1">TV Box</div>
                                <div className="measurement-value text-lg font-bold">{tvDims.width}" x {tvDims.height}" x {tvDims.depth}"</div>
                            </div>
                            <div className="measurement-card bg-slate-50 p-4 rounded-lg border">
                                <div className="measurement-label text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    {fitResult.scenario ? scenarioLabels[fitResult.scenario] : 'Cargo Space'}
                                </div>
                                <div className="measurement-value text-lg font-bold">{fitResult.dimensions ? `${fitResult.dimensions.width}"W x ${fitResult.dimensions.height}"H x ${fitResult.dimensions.length}"D` : 'N/A'}</div>
                            </div>
                          </div>

                          {fitResult.fits && (
                            <Alert variant="default" className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">It Fits! {fitResult.tight && "(Tight Fit)"}</AlertTitle>
                                <AlertDescription className="text-green-700">
                                  {`The TV box should fit in the vehicle's ${scenarioLabels[fitResult.scenario!].toLowerCase()}.`}
                                  {fitResult.tight && " There will be less than 2 inches of clearance on at least one side, so load with care."}
                                </AlertDescription>
                            </Alert>
                          )}
                          
                          {fitResult.fits === false && (
                            <div className="space-y-4">
                                <Alert variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                    <AlertTitle>It Won't Fit</AlertTitle>
                                    <AlertDescription>
                                        Based on the dimensions provided, the TV box will not fit in any standard configuration of this vehicle.
                                    </AlertDescription>
                                </Alert>
                                <Button onClick={handleGetSuggestions} disabled={isSuggestionLoading} className="w-full">
                                  {isSuggestionLoading ? <LoaderCircle className="animate-spin" /> : <Lightbulb />} Get AI Suggestions
                                </Button>
                            </div>
                          )}

                          <div className="flex justify-end pt-4 border-t">
                            <Button variant="secondary" onClick={() => setIsFeedbackOpen(true)}>
                                <MessageSquareQuote className="mr-2" />
                                Provide Feedback
                            </Button>
                          </div>

                          {isSuggestionLoading && (
                            <div className="text-center p-8">
                              <LoaderCircle className="animate-spin h-8 w-8 mx-auto text-primary"/>
                              <p className="mt-2 text-muted-foreground">Generating suggestions...</p>
                            </div>
                          )}
                          
                          {suggestions && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="text-accent"/>AI-Powered Alternatives</CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <Tabs defaultValue="alt-sizes">
                                    <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="alt-sizes">Smaller TVs</TabsTrigger>
                                      <TabsTrigger value="loading-tips">Other Options</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="alt-sizes" className="pt-4">
                                      <Alert>
                                        <AlertTitle>Alternative TV Sizes</AlertTitle>
                                        <AlertDescription>
                                          <p className="mb-2">Here are some smaller TV sizes that are more likely to fit:</p>
                                          <ul className="list-disc pl-5 space-y-2 mt-2">
                                            {suggestions.tvSizeSuggestions.suggestions.map((s, i) => (
                                              <li key={i}>
                                                A TV with box dimensions around <strong>{s.tvWidth}"W x {s.tvHeight}"H x {s.tvDepth}"D</strong> might work. {s.reason}
                                              </li>
                                            ))}
                                          </ul>
                                        </AlertDescription>
                                      </Alert>
                                    </TabsContent>
                                    <TabsContent value="loading-tips" className="pt-4">
                                      <Alert>
                                        <AlertTitle>Alternative Loading Options</AlertTitle>
                                        <AlertDescription>
                                          <ul className="list-disc pl-5 space-y-2 mt-2">
                                            {suggestions.loadingSuggestions.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                          </ul>
                                        </AlertDescription>
                                      </Alert>
                                    </TabsContent>
                                  </Tabs>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                    </Card>
                  )}
                </div>
              </form>
            </TabsContent>

            {/* TV FINDER TAB */}
            <TabsContent value="tv-finder">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="md:col-span-1 space-y-8">
                    <div className="bg-card border rounded-lg shadow-sm p-6">
                        {renderVehicleForm()}
                        <div className="action-buttons flex gap-4 mt-8 pt-6 border-t">
                            <Button onClick={onFindTvs} size="lg" className="flex-grow" disabled={isFindTvsDisabled || isFinding}>
                                {isFinding ? <LoaderCircle className="animate-spin mr-2" /> : <Search className="mr-2" />}
                                Find TVs That Fit
                            </Button>
                             <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                                <RotateCcw className="mr-2" />Reset
                            </Button>
                        </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 space-y-6">
                    {isFinding && (
                        <div className="text-center p-8">
                            <LoaderCircle className="animate-spin h-8 w-8 mx-auto text-primary"/>
                            <p className="mt-2 text-muted-foreground">Searching for compatible TVs...</p>
                        </div>
                    )}
                    {compatibleTvSizes !== null && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Compatible TV Sizes</CardTitle>
                                <CardDescription>The following TV screen sizes should fit in the selected vehicle.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {compatibleTvSizes.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {compatibleTvSizes.map(size => (
                                            <div key={size} className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground font-bold rounded-md text-lg">
                                                {size}"
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Alert>
                                        <XCircle className="h-4 w-4" />
                                        <AlertTitle>No Compatible TVs Found</AlertTitle>
                                        <AlertDescription>
                                            Based on our database, no standard TV sizes will fit in this vehicle.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <p className="text-xs text-muted-foreground mt-4">Note: This check is based on the largest available cargo space (usually with seats down). Always double-check measurements.</p>
                            </CardContent>
                        </Card>
                    )}
                  </div>
              </div>
            </TabsContent>

            {/* VEHICLE FINDER TAB */}
            <TabsContent value="vehicle-finder">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="md:col-span-1 space-y-8">
                    <div className="bg-card border rounded-lg shadow-sm p-6">
                        {renderTvForm()}
                        <div className="action-buttons flex gap-4 mt-8 pt-6 border-t">
                            <Button onClick={onFindVehicles} size="lg" className="flex-grow" disabled={isFindVehiclesDisabled || isFinding}>
                                {isFinding ? <LoaderCircle className="animate-spin mr-2" /> : <Search className="mr-2" />}
                                Find Compatible Vehicles
                            </Button>
                             <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                                <RotateCcw className="mr-2" />Reset
                            </Button>
                        </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 space-y-6">
                    {isFinding && (
                        <div className="text-center p-8">
                            <LoaderCircle className="animate-spin h-8 w-8 mx-auto text-primary"/>
                            <p className="mt-2 text-muted-foreground">Searching for compatible vehicles...</p>
                        </div>
                    )}
                    {compatibleVehicles !== null && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Compatible Vehicles</CardTitle>
                                <CardDescription>The following vehicles should fit the selected TV.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {compatibleVehicles.length > 0 ? (
                                    <ul className="space-y-2">
                                        {compatibleVehicles.map((vehicle, i) => (
                                            <li key={i} className="flex items-center justify-between p-3 bg-secondary rounded-md text-sm">
                                                <span className="font-semibold text-secondary-foreground">{vehicle.name}</span>
                                                <span className="text-muted-foreground">{vehicle.scenario}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Alert>
                                        <XCircle className="h-4 w-4" />
                                        <AlertTitle>No Compatible Vehicles Found</AlertTitle>
                                        <AlertDescription>
                                            Based on our database, no standard vehicles will fit this TV. This may indicate a need for a delivery service or a rental vehicle.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}
                  </div>
              </div>
            </TabsContent>
        </Tabs>
        
         <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>How'd we do?</DialogTitle>
                    <DialogDescription>
                        Your feedback helps improve this tool for everyone. It's completely optional.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>How would you rate the app's usefulness?</Label>
                         <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                key={rating}
                                className={cn(
                                    "h-8 w-8 cursor-pointer transition-colors",
                                    feedbackRating >= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                )}
                                onClick={() => setFeedbackRating(rating)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback-comment">How could we improve this app?</Label>
                      <Textarea 
                        id="feedback-comment"
                        placeholder="e.g., The dimensions for the Honda CR-V seemed off, the actual space was smaller."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="hide-feedback" checked={hideFeedbackDialog} onCheckedChange={(checked) => setHideFeedbackDialog(checked as boolean)} />
                        <Label htmlFor="hide-feedback" className="text-sm font-normal text-muted-foreground">Don't show this again</Label>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleFeedbackSubmit}>Submit Feedback</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </Form>
  )
}
