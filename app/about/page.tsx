'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-space-black">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-white font-montserrat mb-6">
                About Freezing Point
              </h1>
              <p className="text-xl text-gray-300 font-montserrat max-w-3xl mx-auto">
                Exploring the frontiers of artificial intelligence, where innovation meets insight
              </p>
            </div>

            {/* Mission Section */}
            <div className="glass-morphism rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-white font-montserrat mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 font-montserrat leading-relaxed mb-6">
                At Freezing Point AI, we believe that artificial intelligence represents the most 
                transformative technology of our time. Our mission is to bridge the gap between 
                cutting-edge research and practical understanding, making the complex world of AI 
                accessible to everyone.
              </p>
              <p className="text-lg text-gray-300 font-montserrat leading-relaxed">
                We curate and analyze the latest developments in machine learning, computer vision, 
                natural language processing, robotics, and beyond, providing you with insights that 
                matter in an ever-evolving technological landscape.
              </p>
            </div>

            {/* What We Do */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-morphism rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-cobalt-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-white font-montserrat mb-3">
                  Research Analysis
                </h3>
                <p className="text-gray-300 font-montserrat">
                  Deep dives into groundbreaking AI research papers and their real-world implications
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-morphism rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-cobalt-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-white font-montserrat mb-3">
                  Industry Signals
                </h3>
                <p className="text-gray-300 font-montserrat">
                  Tracking emerging trends and signals that shape the future of AI technology
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass-morphism rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-cobalt-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-white font-montserrat mb-3">
                  The Observer
                </h3>
                <p className="text-gray-300 font-montserrat">
                  Thoughtful commentary and analysis on the broader AI ecosystem and its impact
                </p>
              </motion.div>
            </div>

            {/* Values */}
            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white font-montserrat mb-8 text-center">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-cobalt-blue rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white font-montserrat mb-2">
                      Accuracy First
                    </h4>
                    <p className="text-gray-300 font-montserrat">
                      We prioritize factual accuracy and thorough research in everything we publish
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-cobalt-blue rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white font-montserrat mb-2">
                      Accessibility
                    </h4>
                    <p className="text-gray-300 font-montserrat">
                      Making complex AI concepts understandable without oversimplification
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-cobalt-blue rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white font-montserrat mb-2">
                      Forward Thinking
                    </h4>
                    <p className="text-gray-300 font-montserrat">
                      Focusing on emerging technologies and their potential future impact
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-cobalt-blue rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white font-montserrat mb-2">
                      Ethical Awareness
                    </h4>
                    <p className="text-gray-300 font-montserrat">
                      Considering the ethical implications and societal impact of AI developments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 