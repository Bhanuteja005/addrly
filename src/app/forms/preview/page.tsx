"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoaderIcon, CalendarIcon, Upload, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface Form {
  title: string;
  description: string;
  fields: FormField[];
}

export default function FormPreviewPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dates, setDates] = useState<Record<string, Date>>({});

  useEffect(() => {
    // For preview, we'll use mock data since we can't pass complex data via URL
    // In a real app, you'd pass the form data via URL params or localStorage
    const mockForm: Form = {
      title: "Sample Dating Form",
      description: "This is a preview of how your form will look to applicants.",
      fields: [
        { id: '1', type: 'short_answer', label: 'Name', required: true },
        { id: '2', type: 'short_answer', label: 'Email', required: true },
        { id: '3', type: 'long_answer', label: 'Tell us about yourself', required: false },
        { id: '4', type: 'date', label: 'Your birthdate', required: true },
        { id: '5', type: 'multiple_choice', label: 'What are you looking for?', required: true, options: ['Long-term relationship', 'Short-term dating', 'Friendship', 'Casual dating'] }
      ]
    };
    setForm(mockForm);
  }, []);

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <LoaderIcon className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => window.close()}
            className="text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <div className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">
            Preview Mode
          </div>
        </div>

        <Card className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">{form.title}</h1>
              {form.description && (
                <p className="text-neutral-400">{form.description}</p>
              )}
            </div>

            <form className="space-y-6">
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
                      placeholder="Your answer"
                    />
                  )}

                  {field.type === 'long_answer' && (
                    <Textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                      placeholder="Your answer"
                      rows={4}
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                      placeholder="Your answer"
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
                          {dates[field.id] ? format(dates[field.id], "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
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
                        <label key={i} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={formData[field.id] === option}
                            onChange={(e) => updateFormData(field.id, e.target.value)}
                            required={field.required}
                            className="text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-neutral-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'phone' && (
                    <Input
                      type="tel"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                      placeholder="Your phone number"
                    />
                  )}

                  {field.type === 'linkedin' && (
                    <Input
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  )}

                  {field.type === 'other_links' && (
                    <Input
                      value={formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                      required={field.required}
                      placeholder="https://example.com"
                    />
                  )}

                  {field.type === 'file_upload' && (
                    <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-neutral-400 mb-2">Click to upload or drag and drop</p>
                      <Button variant="outline" size="sm" className="border-neutral-700 text-white hover:bg-neutral-800">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
                >
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