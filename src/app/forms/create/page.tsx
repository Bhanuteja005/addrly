"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon, ArrowLeft, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface FormField {
  id: string;
  type: 'short_answer' | 'long_answer' | 'number' | 'multiple_choice' | 'phone' | 'linkedin' | 'other_links' | 'date' | 'file_upload';
  label: string;
  required: boolean;
  options?: string[];
}

export default function CreateFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', type: 'short_answer', label: 'Name', required: true },
    { id: '2', type: 'short_answer', label: 'Email', required: true }
  ]);
  const [showFieldMenu, setShowFieldMenu] = useState(false);

  const fieldTypes = [
    { value: 'short_answer', label: 'Short answer', icon: 'T' },
    { value: 'long_answer', label: 'Long answer', icon: '≡' },
    { value: 'number', label: 'Number', icon: '#' },
    { value: 'multiple_choice', label: 'Multiple choice', icon: '☰' },
    { value: 'phone', label: 'Phone', icon: '☎' },
    { value: 'linkedin', label: 'LinkedIn profile', icon: 'in' },
    { value: 'other_links', label: 'Other links', icon: '×' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'file_upload', label: 'File upload', icon: '📎' },
  ];

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: fieldTypes.find(f => f.value === type)?.label || 'New Field',
      required: false,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2'] : undefined
    };
    setFields([...fields, newField]);
    setShowFieldMenu(false);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handlePublish = async () => {
    if (!formTitle.trim()) {
      return toast.error('Please enter a form title');
    }

    if (fields.length === 0) {
      return toast.error('Please add at least one field');
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/api/forms', {
        title: formTitle,
        description: formDescription,
        fields: fields,
        status: 'active'
      });

      toast.success('Form published successfully!');
      router.push(`/home`);
    } catch (error: any) {
      console.error('Form creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <span className="text-sm text-neutral-500">Changes saved.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => window.open('/forms/preview', '_blank')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6"
              >
                {isLoading ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white border border-neutral-200 shadow-sm mb-4">
          <CardContent className="p-12">
            {/* Title */}
            <div className="mb-6">
              <Input
                placeholder="Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-4xl font-bold border-0 border-b border-dotted border-neutral-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <Textarea
                placeholder="Add a description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-sm text-neutral-600 border-0 resize-none focus-visible:ring-0 px-0 min-h-[60px]"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="group relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="font-medium border-0 border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 rounded-none px-0 focus-visible:ring-0"
                        />
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                      
                      {field.type === 'short_answer' && (
                        <div className="border-b border-neutral-200 pb-2 text-sm text-neutral-400">
                          Short answer text
                        </div>
                      )}
                      
                      {field.type === 'long_answer' && (
                        <Textarea
                          disabled
                          placeholder="Long answer text"
                          className="text-sm text-neutral-400 border border-neutral-200 rounded-lg"
                          rows={3}
                        />
                      )}
                      
                      {field.type === 'number' && (
                        <Input
                          type="number"
                          disabled
                          placeholder="Number"
                          className="text-sm text-neutral-400 border border-neutral-200"
                        />
                      )}
                      
                      {field.type === 'multiple_choice' && field.options && (
                        <div className="space-y-2">
                          {field.options.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...field.options!];
                                  newOptions[i] = e.target.value;
                                  updateField(field.id, { options: newOptions });
                                }}
                                className="text-sm border-0 border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 rounded-none px-0 focus-visible:ring-0"
                              />
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                              updateField(field.id, { options: newOptions });
                            }}
                            className="text-neutral-600 hover:text-neutral-900"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add option
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Field Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => updateField(field.id, { required: !field.required })}
                      >
                        <Check className={`w-4 h-4 ${field.required ? 'text-green-600' : 'text-neutral-400'}`} />
                      </Button>
                      {!field.required && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8"
                          onClick={() => removeField(field.id)}
                        >
                          <X className="w-4 h-4 text-neutral-400 hover:text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Field Button */}
        <div className="relative">
          <Button
            onClick={() => setShowFieldMenu(!showFieldMenu)}
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new question
            <kbd className="ml-2 px-2 py-0.5 text-xs border border-neutral-300 rounded bg-neutral-50">K</kbd>
          </Button>

          {/* Field Type Menu */}
          {showFieldMenu && (
            <Card className="absolute top-12 left-0 bg-white border shadow-lg z-10 w-64">
              <CardContent className="p-2">
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value as FormField['type'])}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 rounded-lg text-left transition-colors"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium text-neutral-700">{type.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
