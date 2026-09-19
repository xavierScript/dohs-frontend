import React from "react";
import { Shield, Users, Award, Clock, Globe, Zap } from "lucide-react";

function WhyChooseUs() {
  const reasons = [
    {
      icon: Shield,
      title: "Comprehensive Protection",
      description:
        "Integrated One Health approach protecting humans, animals, and the environment.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Multidisciplinary team of health professionals, veterinarians, and environmental scientists.",
      color: "green",
    },
    {
      icon: Award,
      title: "Proven Excellence",
      description:
        "Track record of successful disease surveillance and rapid response interventions.",
      color: "purple",
    },
    {
      icon: Clock,
      title: "Real-Time Monitoring",
      description:
        "24/7 surveillance system with immediate alerts for emerging health threats.",
      color: "orange",
    },
    {
      icon: Globe,
      title: "Wide Coverage",
      description:
        "Extensive network covering all regions with local and national coordination.",
      color: "indigo",
    },
    {
      icon: Zap,
      title: "Rapid Response",
      description:
        "Quick deployment and intervention capabilities for health emergencies.",
      color: "red",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
      red: "bg-red-50 text-red-600 border-red-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="w-full px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the advantages of our integrated One Health surveillance
            system designed to protect communities across Nigeria.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div
                  className={`inline-flex p-3 rounded-lg mb-4 border ${getColorClasses(
                    reason.color
                  )}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-6">
            Join thousands of stakeholders already using our platform for
            effective health surveillance.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
