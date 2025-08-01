"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Languages, Loader2, Wand2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { useToast } from "@/hooks/use-toast";
import { indianLanguages } from "@/utils/data";
import { geminiService, SafetyQuery } from "@/services/gemini";
import { useLanguage } from "@/context/LanguageContext";

const safetyTipsSchema = z.object({
  query: z.string().min(10, { message: "Please enter a more detailed query." }),
  targetLanguage: z.string({ required_error: "Please select a language." }),
});

export function SafetyTips() {
  const { t } = useLanguage();
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof safetyTipsSchema>>({
    resolver: zodResolver(safetyTipsSchema),
    defaultValues: {
      query: "Safety measures for deep sea fishing during monsoon.",
      targetLanguage: "en",
    },
  });

  async function onSubmit(values: z.infer<typeof safetyTipsSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const safetyQuery: SafetyQuery = {
        query: values.query,
        weatherConditions: values.query.includes('monsoon') ? 'monsoon' : 
                          values.query.includes('storm') ? 'stormy' : 
                          values.query.includes('calm') ? 'calm' : undefined,
        fishingType: values.query.includes('deep sea') ? 'deep sea' : 
                    values.query.includes('coastal') ? 'coastal' : 
                    values.query.includes('river') ? 'river' : undefined,
      };
      
      const response = await geminiService.getSafetyGuidelines(safetyQuery);
      setResult(response);
      
      toast({
        title: "Success",
        description: "Safety guidelines retrieved successfully!",
      });
    } catch (error) {
      console.error("Error fetching safety tips:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch safety guidelines. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="modern-card-tall">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          {t('safety_practices_title')}
        </CardTitle>
        <CardDescription>
          {t('safety_practices_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{t('safety_query_label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('safety_query_placeholder')}
                      className="glass-input min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{t('language_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder={t('select_language_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass-card max-h-[200px]">
                      {indianLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="hover:bg-muted/50">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="glass-button-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('get_guidelines_button')}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t('get_guidelines_button')}
                </>
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-foreground font-claude">Safety Guidelines</h3>
            </div>
            
                          <div className="glass-card-sm p-4 md:p-6">
                <Markdown 
                  content={result}
                  className="text-muted-foreground leading-relaxed font-claude"
                />
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
