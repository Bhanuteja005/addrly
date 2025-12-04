import { DownloadIcon, FilterIcon, TrendingUpIcon } from "lucide-react";
import Container from "../global/container";
import { Button } from "../ui/button";
import { MagicCard } from "../ui/magic-card";

const Analysis = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug">
                        Your dating  <br /><span className="font-subheading italic">analytics</span>
                    </h2>
                    <p className="text-base md:text-lg text-accent-foreground/80 mt-4">
                        Track your applications, compatibility scores, and find your perfect match with data-driven insights.
                    </p>
                </div>
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative w-full">

                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                        <MagicCard
                            gradientFrom="#38bdf8"
                            gradientTo="#3b82f6"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-4 lg:p-8 w-full overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 bg-blue-500 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Application Insights
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Track your DateMeDoc applications and response rates.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold">
                                                127
                                            </div>
                                            <div className="text-sm text-green-500 flex items-center gap-1 mt-2">
                                                <TrendingUpIcon className="w-4 h-4" />
                                                +48 this week
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <FilterIcon className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <DownloadIcon className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4 text-sm text-muted-foreground py-2">
                                            <div>Applicant</div>
                                            <div>Status</div>
                                            <div>Score</div>
                                            <div>Vibes</div>
                                        </div>
                                        {[
                                            { name: "@john_doe", status: "Pending", reach: "94%", roi: "✨✨✨" },
                                            { name: "@alex_m", status: "Reviewed", reach: "87%", roi: "✨✨" },
                                            { name: "@sarah_k", status: "Pending", reach: "91%", roi: "✨✨✨" },
                                        ].map((campaign) => (
                                            <div key={campaign.name} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                                                <div>{campaign.name}</div>
                                                <div>{campaign.status}</div>
                                                <div>{campaign.reach}</div>
                                                <div className="font-semibold">{campaign.roi}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>

                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                        <MagicCard
                            gradientFrom="#38bdf8"
                            gradientTo="#3b82f6"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-4 lg:p-8 w-full overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 bg-sky-500 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Compatibility Metrics
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Understand your match potential and vibe compatibility scores.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold">89%</div>
                                            <div className="text-sm text-green-500 flex items-center gap-1 mt-2">
                                                <TrendingUpIcon className="w-4 h-4" />
                                                Your avg compatibility
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <FilterIcon className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <DownloadIcon className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Audience Table */}
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4 text-sm text-muted-foreground py-2">
                                            <div>Category</div>
                                            <div>Score</div>
                                            <div>Matches</div>
                                            <div>Trend</div>
                                        </div>
                                        {[
                                            { channel: "Humor", users: "92%", sessions: "45", rate: "📈" },
                                            { channel: "Music", users: "87%", sessions: "38", rate: "📈" },
                                            { channel: "Values", users: "94%", sessions: "52", rate: "🔥" },
                                        ].map((metric) => (
                                            <div key={metric.channel} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                                                <div>{metric.channel}</div>
                                                <div>{metric.users}</div>
                                                <div>{metric.sessions}</div>
                                                <div className="font-semibold">{metric.rate}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>
            </div>
        </div>
    )
};

export default Analysis;
