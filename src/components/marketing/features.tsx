import { FEATURES } from "@/constants";
import { cn } from "@/lib";
import { HeartIcon, XIcon, SparklesIcon, MusicIcon, CoffeeIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Container from "../global/container";
import { MagicCard } from "../ui/magic-card";

const DateMeDocPreview = () => (
    <div className="mt-6 w-full overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-neutral-100">
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-xs font-medium text-neutral-800">My DateMeDoc</p>
                    <p className="text-[10px] text-neutral-400">@username</p>
                </div>
            </div>
            
            {/* Likes */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <HeartIcon className="w-3 h-3 text-rose-400" />
                    <span className="text-[10px] font-medium text-neutral-600">Likes</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {["coffee dates", "late night drives", "indie music"].map((item) => (
                        <span key={item} className="px-2 py-0.5 bg-neutral-50 rounded-full text-[9px] text-neutral-600 border border-neutral-100">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Dislikes */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <XIcon className="w-3 h-3 text-neutral-400" />
                    <span className="text-[10px] font-medium text-neutral-600">Icks</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {["dry texters", "no music taste"].map((item) => (
                        <span key={item} className="px-2 py-0.5 bg-neutral-50 rounded-full text-[9px] text-neutral-600 border border-neutral-100">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-1">
                    <MusicIcon className="w-3 h-3 text-sky-400" />
                    <span className="text-[9px] text-neutral-500">Spotify linked</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3 text-sky-400" />
                    <span className="text-[9px] text-neutral-500">NYC</span>
                </div>
            </div>
        </div>
    </div>
);

const Features = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
                        Dating for the <br /> chronically <span className="font-subheading italic">online</span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
                        We turned the unhinged concept of boyfriend applications into an actual app. Because if you're gonna be chronically online, might as well find love there.
                    </p>
                </div>
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 relative overflow-visible">

                {FEATURES.map((feature, index) => (
                    <Container key={feature.title} delay={0.1 + index * 0.1} className={cn(
                        "relative flex flex-col rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-border/100 transition-colors",
                        index === 3 && "lg:col-span-2",
                        index === 2 && "md:col-span-2 lg:col-span-1",
                    )}>
                        <MagicCard
                            gradientFrom="#38bdf8"
                            gradientTo="#3b82f6"
                            className="p-4 lg:p-6 lg:rounded-3xl"
                            gradientColor="rgba(59,130,246,0.1)"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <feature.icon className="size-5 text-primary" />
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>

                            {index === 0 ? (
                                <DateMeDocPreview />
                            ) : (
                                <div className="mt-6 w-full bg-card/50 overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </MagicCard>
                    </Container>
                ))}
            </div>
        </div>
    )
};

export default Features
