"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { OnboardingFormData } from "@/types/user";

const OnboardingPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState<OnboardingFormData>({
        full_name: '',
        age: 18,
        gender: '',
        location: '',
        bio: '',
        interests: [],
        looking_for: '',
        relationship_type: '',
        personality_type: '',
        hobbies: [],
        lifestyle: '',
        education: '',
        occupation: '',
        social_media_urls: {
            instagram: '',
            twitter: '',
            linkedin: '',
            tiktok: ''
        },
        preferred_age_range: {
            min: 18,
            max: 35
        },
        deal_breakers: [],
        values: []
    });

    useEffect(() => {
        checkAuth();
    }, [router]);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin');
                return;
            }

            // Check if user has already completed onboarding
            const { data: profile } = await supabase
                .from('profiles')
                .select('profile_completed')
                .eq('id', session.user.id)
                .single();

            if (profile?.profile_completed) {
                // User already completed onboarding, redirect to home
                router.push('/home');
                return;
            }

            // Pre-fill name from auth metadata
            if (session.user.user_metadata?.full_name) {
                setFormData(prev => ({
                    ...prev,
                    full_name: session.user.user_metadata.full_name
                }));
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent as keyof OnboardingFormData] as any),
                [field]: value
            }
        }));
    };

    const handleArrayToggle = (field: string, value: string) => {
        setFormData(prev => {
            const currentArray = prev[field as keyof OnboardingFormData] as string[];
            if (currentArray.includes(value)) {
                return {
                    ...prev,
                    [field]: currentArray.filter(item => item !== value)
                };
            } else {
                return {
                    ...prev,
                    [field]: [...currentArray, value]
                };
            }
        });
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.full_name || !formData.age || !formData.gender) {
                    toast.error("Please fill in all basic information");
                    return false;
                }
                if (formData.age < 18 || formData.age > 100) {
                    toast.error("Age must be between 18 and 100");
                    return false;
                }
                return true;
            case 2:
                if (!formData.location || !formData.bio) {
                    toast.error("Please fill in your location and bio");
                    return false;
                }
                if (formData.bio.length < 50) {
                    toast.error("Bio must be at least 50 characters");
                    return false;
                }
                return true;
            case 3:
                if (formData.interests.length === 0) {
                    toast.error("Please select at least one interest");
                    return false;
                }
                return true;
            case 4:
                if (!formData.looking_for || !formData.relationship_type) {
                    toast.error("Please specify what you're looking for");
                    return false;
                }
                return true;
            case 5:
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                throw new Error('No active session');
            }

            // Submit to backend API
            const response = await apiClient.post('/api/users/onboarding', formData);

            if (response.data.success) {
                toast.success("Profile completed successfully!");
                router.push('/home');
            }
        } catch (err: any) {
            console.error('Onboarding error:', err);
            toast.error(err.response?.data?.error || "Failed to complete onboarding. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const interestOptions = [
        "Music", "Movies", "Travel", "Fitness", "Cooking", "Reading",
        "Gaming", "Art", "Photography", "Dancing", "Sports", "Fashion",
        "Technology", "Nature", "Food", "Pets", "Writing", "Yoga"
    ];

    const hobbyOptions = [
        "Hiking", "Painting", "Playing Instruments", "Coding", "Gardening",
        "Cycling", "Swimming", "Photography", "Crafting", "Baking",
        "Running", "Meditation", "Volunteering", "Board Games"
    ];

    const valueOptions = [
        "Honesty", "Loyalty", "Kindness", "Humor", "Ambition",
        "Family-Oriented", "Adventure", "Intelligence", "Creativity",
        "Empathy", "Independence", "Communication"
    ];

    const dealBreakerOptions = [
        "Smoking", "No Job", "Poor Hygiene", "Rudeness", "Dishonesty",
        "No Ambition", "Party Lifestyle", "Different Politics",
        "No Pets", "Long Distance"
    ];

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
                <LoaderIcon className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-neutral-300">
                            Step {currentStep} of {totalSteps}
                        </h2>
                        <span className="text-sm text-neutral-400">
                            {Math.round((currentStep / totalSteps) * 100)}% Complete
                        </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Let's start with the basics
                                    </h1>
                                    <p className="text-neutral-400">
                                        Tell us a bit about yourself
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="full_name">Full Name *</Label>
                                        <Input
                                            id="full_name"
                                            value={formData.full_name}
                                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                                            placeholder="Enter your full name"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                min="18"
                                                max="100"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="gender">Gender *</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(value) => handleInputChange('gender', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="non-binary">Non-binary</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="occupation">Occupation</Label>
                                        <Input
                                            id="occupation"
                                            value={formData.occupation}
                                            onChange={(e) => handleInputChange('occupation', e.target.value)}
                                            placeholder="What do you do?"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="education">Education</Label>
                                        <Select
                                            value={formData.education}
                                            onValueChange={(value) => handleInputChange('education', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select education level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high-school">High School</SelectItem>
                                                <SelectItem value="some-college">Some College</SelectItem>
                                                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                                <SelectItem value="masters">Master's Degree</SelectItem>
                                                <SelectItem value="phd">PhD</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location & Bio */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Where are you and what's your story?
                                    </h1>
                                    <p className="text-neutral-400">
                                        Help others get to know you better
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location">Location *</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="City, Country"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="bio">About You * (min. 50 characters)</Label>
                                        <Textarea
                                            id="bio"
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            placeholder="Tell us about yourself, your passions, what makes you unique..."
                                            className="mt-1 min-h-[150px]"
                                        />
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {formData.bio.length} / 50 characters minimum
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="lifestyle">Lifestyle</Label>
                                        <Select
                                            value={formData.lifestyle}
                                            onValueChange={(value) => handleInputChange('lifestyle', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select your lifestyle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active & Outdoorsy</SelectItem>
                                                <SelectItem value="balanced">Balanced</SelectItem>
                                                <SelectItem value="homebody">Homebody</SelectItem>
                                                <SelectItem value="social">Very Social</SelectItem>
                                                <SelectItem value="adventurous">Adventurous</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="personality">Personality Type</Label>
                                        <Input
                                            id="personality"
                                            value={formData.personality_type}
                                            onChange={(e) => handleInputChange('personality_type', e.target.value)}
                                            placeholder="e.g., INTJ, Enneagram 4, etc."
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Interests & Hobbies */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        What do you love doing?
                                    </h1>
                                    <p className="text-neutral-400">
                                        Select your interests and hobbies (Choose at least 3)
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base mb-3 block">Interests *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {interestOptions.map((interest) => (
                                                <div
                                                    key={interest}
                                                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all min-h-[48px] ${
                                                        formData.interests.includes(interest)
                                                            ? 'border-pink-500 bg-pink-500/10 text-white'
                                                            : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`interest-${interest}`}
                                                        checked={formData.interests.includes(interest)}
                                                        onCheckedChange={() => handleArrayToggle('interests', interest)}
                                                    />
                                                    <Label
                                                        htmlFor={`interest-${interest}`}
                                                        className="cursor-pointer flex-1 text-sm leading-tight"
                                                    >
                                                        {interest}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-base mb-3 block">Hobbies</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {hobbyOptions.map((hobby) => (
                                                <div
                                                    key={hobby}
                                                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all min-h-[48px] ${
                                                        formData.hobbies?.includes(hobby)
                                                            ? 'border-purple-500 bg-purple-500/10 text-white'
                                                            : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`hobby-${hobby}`}
                                                        checked={formData.hobbies?.includes(hobby)}
                                                        onCheckedChange={() => handleArrayToggle('hobbies', hobby)}
                                                    />
                                                    <Label
                                                        htmlFor={`hobby-${hobby}`}
                                                        className="cursor-pointer flex-1 text-sm leading-tight"
                                                    >
                                                        {hobby}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Looking For */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        What are you looking for?
                                    </h1>
                                    <p className="text-neutral-400">
                                        Tell us about your ideal match
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="looking_for">I'm looking for *</Label>
                                        <Select
                                            value={formData.looking_for}
                                            onValueChange={(value) => handleInputChange('looking_for', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select what you're looking for" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="men">Men</SelectItem>
                                                <SelectItem value="women">Women</SelectItem>
                                                <SelectItem value="everyone">Everyone</SelectItem>
                                                <SelectItem value="non-binary">Non-binary People</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="relationship_type">Relationship Type *</Label>
                                        <Select
                                            value={formData.relationship_type}
                                            onValueChange={(value) => handleInputChange('relationship_type', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="What kind of relationship?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="long-term">Long-term Relationship</SelectItem>
                                                <SelectItem value="dating">Dating</SelectItem>
                                                <SelectItem value="casual">Casual</SelectItem>
                                                <SelectItem value="friendship">Friendship</SelectItem>
                                                <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="block mb-2">Preferred Age Range</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="age_min" className="text-sm text-neutral-600">Min Age</Label>
                                                <Input
                                                    id="age_min"
                                                    type="number"
                                                    min="18"
                                                    max="100"
                                                    value={formData.preferred_age_range?.min}
                                                    onChange={(e) => handleNestedChange('preferred_age_range', 'min', parseInt(e.target.value))}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="age_max" className="text-sm text-neutral-600">Max Age</Label>
                                                <Input
                                                    id="age_max"
                                                    type="number"
                                                    min="18"
                                                    max="100"
                                                    value={formData.preferred_age_range?.max}
                                                    onChange={(e) => handleNestedChange('preferred_age_range', 'max', parseInt(e.target.value))}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-base mb-3 block">Important Values</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {valueOptions.map((value) => (
                                                <div
                                                    key={value}
                                                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all min-h-[48px] ${
                                                        formData.values?.includes(value)
                                                            ? 'border-blue-500 bg-blue-500/10 text-white'
                                                            : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`value-${value}`}
                                                        checked={formData.values?.includes(value)}
                                                        onCheckedChange={() => handleArrayToggle('values', value)}
                                                    />
                                                    <Label
                                                        htmlFor={`value-${value}`}
                                                        className="cursor-pointer flex-1 text-sm leading-tight"
                                                    >
                                                        {value}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-base mb-3 block">Deal Breakers</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {dealBreakerOptions.map((breaker) => (
                                                <div
                                                    key={breaker}
                                                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all min-h-[48px] ${
                                                        formData.deal_breakers?.includes(breaker)
                                                            ? 'border-red-500 bg-red-500/10 text-white'
                                                            : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`breaker-${breaker}`}
                                                        checked={formData.deal_breakers?.includes(breaker)}
                                                        onCheckedChange={() => handleArrayToggle('deal_breakers', breaker)}
                                                    />
                                                    <Label
                                                        htmlFor={`breaker-${breaker}`}
                                                        className="cursor-pointer flex-1 text-sm leading-tight"
                                                    >
                                                        {breaker}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Social Media & Final */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Connect your social media (Optional)
                                    </h1>
                                    <p className="text-neutral-400">
                                        This helps us analyze your personality and find better matches
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="instagram">Instagram URL</Label>
                                        <Input
                                            id="instagram"
                                            value={formData.social_media_urls?.instagram}
                                            onChange={(e) => handleNestedChange('social_media_urls', 'instagram', e.target.value)}
                                            placeholder="https://instagram.com/yourusername"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="twitter">Twitter/X URL</Label>
                                        <Input
                                            id="twitter"
                                            value={formData.social_media_urls?.twitter}
                                            onChange={(e) => handleNestedChange('social_media_urls', 'twitter', e.target.value)}
                                            placeholder="https://twitter.com/yourusername"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin"
                                            value={formData.social_media_urls?.linkedin}
                                            onChange={(e) => handleNestedChange('social_media_urls', 'linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/in/yourusername"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="tiktok">TikTok URL</Label>
                                        <Input
                                            id="tiktok"
                                            value={formData.social_media_urls?.tiktok}
                                            onChange={(e) => handleNestedChange('social_media_urls', 'tiktok', e.target.value)}
                                            placeholder="https://tiktok.com/@yourusername"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                                        <h3 className="font-semibold text-blue-400 mb-2">🔒 Privacy Note</h3>
                                        <p className="text-sm text-neutral-300">
                                            Your social media information is used only for AI-powered personality analysis 
                                            to find compatible matches. We never post on your behalf or share your data publicly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="rounded-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                            Completing...
                                        </>
                                    ) : (
                                        'Complete Profile'
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
