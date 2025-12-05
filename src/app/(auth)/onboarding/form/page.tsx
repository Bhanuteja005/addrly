"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderIcon, ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type FieldType = 'text' | 'textarea' | 'single-choice' | 'multi-choice' | 'slider' | 'date';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For choice fields
  min?: number; // For slider
  max?: number; // For slider
}

export default function FormBuilderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState("Application Form");

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('application_form')
        .eq('auth_user_id', session.user.id)
        .single();

      if (profile?.application_form) {
        const formData = typeof profile.application_form === 'string' 
          ? JSON.parse(profile.application_form) 
          : profile.application_form;
        setFormTitle(formData.title || "Application Form");
        setFields(formData.fields || []);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: '',
      required: false,
      ...(type === 'single-choice' || type === 'multi-choice' ? { options: [''] } : {}),
      ...(type === 'slider' ? { min: 0, max: 100 } : {}),
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const addOption = (fieldId: string) => {
    setFields(fields.map(f => 
      f.id === fieldId 
        ? { ...f, options: [...(f.options || []), ''] }
        : f
    ));
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    setFields(fields.map(f => 
      f.id === fieldId 
        ? { 
            ...f, 
            options: f.options?.map((opt, idx) => idx === optionIndex ? value : opt) 
          }
        : f
    ));
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    setFields(fields.map(f => 
      f.id === fieldId 
        ? { ...f, options: f.options?.filter((_, idx) => idx !== optionIndex) }
        : f
    ));
  };

  const handleSave = async () => {
    if (fields.length === 0) {
      toast.error("Please add at least one question to your form");
      return;
    }

    // Validate fields
    for (const field of fields) {
      if (!field.label.trim()) {
        toast.error("All fields must have a label");
        return;
      }
      if ((field.type === 'single-choice' || field.type === 'multi-choice') && 
          (!field.options || field.options.length === 0 || field.options.every(o => !o.trim()))) {
        toast.error("Choice fields must have at least one option");
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }

      const formData = {
        title: formTitle,
        fields: fields.map(f => ({
          ...f,
          options: f.options?.filter(o => o.trim()),
        })),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({
          application_form: formData,
          has_form: true,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', session.user.id);

      if (error) throw error;

      toast.success("Form saved!");
      router.push('/onboarding');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <Link href="/onboarding" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 md:mb-10 lg:mb-12">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          <span className="text-base md:text-lg">Back to onboarding</span>
        </Link>

        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal mb-4 md:mb-6">
            Create Application Form
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
            Build questions for potential dates to answer when applying
          </p>
        </div>

        {/* Form Title */}
        <div className="mb-6 md:mb-8 lg:mb-10">
          <Label htmlFor="formTitle" className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Form Title</Label>
          <Input
            id="formTitle"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Application Form"
            className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
          />
        </div>

        {/* Add Field Buttons */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10 p-4 md:p-6 bg-card rounded-xl border border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('text')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Text Input
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('textarea')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Textarea
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('single-choice')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Single Choice
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('multi-choice')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Multiple Choice
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('slider')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Slider
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addField('date')}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-3 md:py-4"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Date
          </Button>
        </div>

        {/* Fields List */}
        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 lg:mb-12">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-card rounded-xl border border-border p-6 md:p-8 lg:p-10">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="pt-2 hidden md:block">
                  <GripVertical className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="flex-1 w-full">
                      <Label className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Question Label *</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Enter question label"
                        className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
                      />
                    </div>
                    <div className="pt-0 md:pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="rounded w-4 h-4 md:w-5 md:h-5"
                        />
                        <span className="text-sm md:text-base lg:text-lg text-muted-foreground">Required</span>
                      </label>
                    </div>
                  </div>

                  {/* Field-specific inputs */}
                  {(field.type === 'text' || field.type === 'textarea' || field.type === 'date') && (
                    <div>
                      <Label className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Placeholder (optional)</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text"
                        className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
                      />
                    </div>
                  )}

                  {(field.type === 'single-choice' || field.type === 'multi-choice') && (
                    <div>
                      <Label className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Options *</Label>
                      <div className="space-y-3 md:space-y-4">
                        {field.options?.map((option, optIdx) => (
                          <div key={optIdx} className="flex gap-3 md:gap-4">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(field.id, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                              className="rounded-xl text-base md:text-lg flex-1 h-12 md:h-14 px-4 md:px-6"
                            />
                            {field.options && field.options.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeOption(field.id, optIdx)}
                                className="rounded-full px-4 md:px-6 h-12 md:h-14"
                              >
                                <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addOption(field.id)}
                          className="rounded-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base"
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  {field.type === 'slider' && (
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <Label className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Min Value</Label>
                        <Input
                          type="number"
                          value={field.min || 0}
                          onChange={(e) => updateField(field.id, { min: parseInt(e.target.value) || 0 })}
                          className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
                        />
                      </div>
                      <div>
                        <Label className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Max Value</Label>
                        <Input
                          type="number"
                          value={field.max || 100}
                          onChange={(e) => updateField(field.id, { max: parseInt(e.target.value) || 100 })}
                          className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => deleteField(field.id)}
                  className="rounded-full text-destructive hover:text-destructive px-4 md:px-6 h-12 md:h-14"
                >
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-12 md:py-16 lg:py-20 bg-card rounded-xl border border-border">
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-4">No questions yet. Add your first question above.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/onboarding')}
            className="rounded-full w-full md:w-auto px-8 md:px-10 py-6 md:py-7 text-base md:text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || fields.length === 0}
            className="rounded-full flex-1 md:flex-initial px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 text-base md:text-lg lg:text-xl"
          >
            {isLoading ? (
              <>
                <LoaderIcon className="w-5 h-5 md:w-6 md:h-6 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                Save & Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

