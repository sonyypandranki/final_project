import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";

const stats = [
  {
    icon: CheckCircle,
    value: "500+",
    label: "Items Successfully Returned",
    description: "Items reunited with their owners"
  },
  {
    icon: Users,
    value: "1,200+",
    label: "Active Community Members",
    description: "Students helping each other"
  },
  {
    icon: Clock,
    value: "24hrs",
    label: "Average Recovery Time",
    description: "Quick turnaround for lost items"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    description: "Items found and returned"
  }
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Trusted by Students
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Our platform has helped thousands of students recover their lost belongings through community support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-white/80">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;