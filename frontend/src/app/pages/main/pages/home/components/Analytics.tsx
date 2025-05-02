import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/Card";
import {
  Code,
  Trophy,
  Star,
  GitBranch,
  Target,
  Zap,
  Brain,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const userPerformance = [
    { month: "Jan", battles: 12, wins: 8, rating: 1200 },
    { month: "Feb", battles: 15, wins: 11, rating: 1250 },
    { month: "Mar", battles: 10, wins: 7, rating: 1280 },
    { month: "Apr", battles: 18, wins: 14, rating: 1350 },
    { month: "May", battles: 14, wins: 11, rating: 1400 },
    { month: "Jun", battles: 16, wins: 13, rating: 1450 },
  ];

  const statsCards = [
    { title: "Total Battles", value: "85", icon: Code, trend: "+5 this month" },
    { title: "Win Rate", value: "76%", icon: Trophy, trend: "+2% this month" },
    {
      title: "Current Rating",
      value: "1450",
      icon: Target,
      trend: "+50 points",
    },
    { title: "Best Streak", value: "8", icon: Zap, trend: "This month" },
  ];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-white pt-4 dark:bg-dark-background border border-light-border dark:border-dark-border hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mt-1">
                      {stat.value}
                    </p>
                    <div className="mt-2 flex items-center">
                      <Star className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Chart */}
        <Card className="bg-white dark:bg-dark-background border border-light-border dark:border-dark-border">
          <CardHeader className="p-4">
            <CardTitle className="text-light-foreground dark:text-dark-foreground flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#452FAB"
                    name="Rating"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Battles */}
        <Card className="bg-white dark:bg-dark-background border border-light-border dark:border-dark-border">
          <CardHeader className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-6 h-6 text-light-primary dark:text-dark-primary" />
              <CardTitle className="text-light-foreground dark:text-dark-foreground">
                Recent Battles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center cursor-pointer justify-between p-4 rounded-lg bg-light-background dark:bg-dark-background/50 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                        Binary Tree Challenge
                      </p>
                      <p className="text-xs text-light-foreground/60 dark:text-dark-foreground/60">
                        Victory • Rating +25
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-light-foreground/60 dark:text-dark-foreground/60">
                    2 hours ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
