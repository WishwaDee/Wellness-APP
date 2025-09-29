import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Heart, Droplets, Sparkles, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      id: 1,
      title: "Track Your Daily Habits",
      subtitle: "Build lasting wellness routines",
      description: "Create and monitor daily habits like drinking water, meditation, exercise, and more. Watch your progress grow day by day with beautiful visualizations.",
      icon: Target,
      color: "from-green-500 to-emerald-600",
      features: [
        "Add custom habits with icons and colors",
        "Track daily completion progress",
        "View streak counters and achievements",
        "Set personalized goals and reminders"
      ],
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="text-center">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-2" />
              <div className="space-y-1">
                <div className="w-12 h-2 bg-green-500 rounded-full mx-auto"></div>
                <div className="w-8 h-2 bg-green-300 rounded-full mx-auto"></div>
                <div className="w-10 h-2 bg-green-400 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Journal Your Emotions",
      subtitle: "Understand your mental wellness",
      description: "Log your daily moods with expressive emojis and personal notes. Track emotional patterns and celebrate your mental health journey.",
      icon: Heart,
      color: "from-purple-500 to-pink-600",
      features: [
        "Express feelings with emoji selection",
        "Add personal notes and reflections",
        "View mood trends and patterns",
        "Celebrate emotional growth"
      ],
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <div className="flex space-x-2 justify-center">
                <span className="text-2xl">😊</span>
                <span className="text-2xl">😍</span>
                <span className="text-2xl">🤗</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
            <span className="text-xl">💝</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Stay Hydrated",
      subtitle: "Never forget to drink water",
      description: "Set personalized hydration goals and receive gentle reminders throughout the day. Track your water intake and maintain optimal hydration levels.",
      icon: Droplets,
      color: "from-blue-500 to-cyan-600",
      features: [
        "Set daily hydration goals",
        "Receive smart reminders",
        "Track water intake progress",
        "Maintain healthy habits"
      ],
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="text-center">
              <Droplets className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <div className="flex space-x-1 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-8 rounded-full ${
                      i <= 3 ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">3/5 glasses</p>
            </div>
          </div>
          <div className="absolute -top-2 -left-2 w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-lg">💧</span>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <button
              onClick={skipOnboarding}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-0">
            {/* Left Side - Illustration */}
            <div className={`bg-gradient-to-br ${currentStepData.color} p-8 lg:p-12 flex items-center justify-center`}>
              <div className="text-center">
                {currentStepData.illustration}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${currentStepData.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <currentStepData.icon className="w-8 h-8 text-white" />
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {currentStepData.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  {currentStepData.subtitle}
                </p>
                
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentStep
                          ? 'bg-blue-500 scale-125'
                          : index < currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === onboardingSteps.length - 1
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span>
                    {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Join thousands of users on their wellness journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;