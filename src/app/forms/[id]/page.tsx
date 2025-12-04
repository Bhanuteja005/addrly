"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoaderIcon, CalendarIcon, Upload, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dates, setDates] = useState<Record<string, Date>>({});

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forms/public/${params.id}`
      );
      setForm(response.data.form);
    } catch (error: any) {
      console.error('Load form error:', error);
      toast.error('Form not found or not available');
      setTimeout(() => router.push('/'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    const missingFields = form.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert dates to ISO strings
      const submissionData = { ...formData };
      Object.keys(dates).forEach(key => {
        submissionData[key] = dates[key].toISOString();
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forms/public/${params.id}/submit`,
        submissionData
      );

      toast.success('Application submitted successfully!');
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <LoaderIcon className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-8 text-center">
            <p className="text-white">Form not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">{form.title}</h1>
              {form.description && (
                <p className="text-neutral-400">{form.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id}>
                  <Label className="text-white mb-2 block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {field.type === 'short_answer' && (
                    <Input
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                    />
                  )}

                  {field.type === 'long_answer' && (
                    <Textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      rows={4}
                      required={field.required}
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                    />
                  )}

                  {field.type === 'phone' && (
                    <Input
                      type="tel"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                    />
                  )}

                  {field.type === 'linkedin' && (
                    <Input
                      type="url"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                    />
                  )}

                  {field.type === 'other_links' && (
                    <Input
                      type="url"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      placeholder="https://..."
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                    />
                  )}

                  {field.type === 'date' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dates[field.id] ? format(dates[field.id], "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-800">
                        <Calendar
                          mode="single"
                          selected={dates[field.id]}
                          onSelect={(date) => {
                            if (date) {
                              setDates(prev => ({ ...prev, [field.id]: date }));
                              updateFormData(field.id, date.toISOString());
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {field.type === 'multiple_choice' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={formData[field.id] === option}
                            onChange={(e) => updateFormData(field.id, e.target.value)}
                            className="w-4 h-4 text-purple-500 bg-neutral-800 border-neutral-700"
                            required={field.required}
                          />
                          <span className="text-neutral-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'file_upload' && (
                    <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                      <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                      <p className="text-sm text-neutral-400 mb-2">
                        Upload a file (Coming soon)
                      </p>
                      <Input
                        type="file"
                        className="hidden"
                        disabled
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-6"
                >
                  {isSubmitting ? (
                    <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}