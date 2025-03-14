
// Simulated OpenAI service integration
// In a production app, this would use actual OpenAI API calls

import { siteTrackingService, TrackedSite } from '../site/siteTrackingService';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  relevantSites?: TrackedSite[];
}

export const openAIService = {
  /**
   * Generate a response using OpenAI
   * In a real implementation, this would make API calls to OpenAI
   */
  generateResponse: async (messages: ChatMessage[], trackedSites: TrackedSite[] = []): Promise<AIResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }
    
    const userInput = lastMessage.content.toLowerCase();
    let response = '';
    let relevantSites: TrackedSite[] = [];
    
    // Check if the query is about properties or websites
    if (userInput.includes('property') || 
        userInput.includes('home') || 
        userInput.includes('house') ||
        userInput.includes('real estate') ||
        userInput.includes('website') ||
        userInput.includes('site')) {
      
      // Find relevant sites
      relevantSites = trackedSites.filter(site => {
        const siteName = site.name.toLowerCase();
        const siteUrl = site.url.toLowerCase();
        const userInputTokens = userInput.split(' ');
        
        return userInputTokens.some(token => 
          token.length > 3 && (siteName.includes(token) || siteUrl.includes(token))
        );
      });
      
      if (relevantSites.length > 0) {
        response = `Based on your query, I found ${relevantSites.length} relevant property websites that might interest you. You can visit them directly or I can help you track new properties on these sites.`;
      } else {
        response = defaultResponse(userInput);
        
        if (trackedSites.length === 0) {
          response += "\n\nYou don't have any property websites tracked yet. Would you like me to help you set up website tracking to monitor property listings?";
        } else {
          response += "\n\nI don't have specific websites matching your query. Would you like to add a new property website to track?";
        }
      }
    } else {
      response = defaultResponse(userInput);
    }
    
    return {
      content: response,
      relevantSites: relevantSites.length > 0 ? relevantSites : undefined
    };
  },

  /**
   * Get website recommendations based on user query
   */
  getWebsiteRecommendations: async (query: string): Promise<TrackedSite[]> => {
    // In a real implementation, this would use AI to recommend websites
    // For simulation, we'll just return all tracked sites
    const sites = siteTrackingService.getTrackedSites();
    
    // Filter sites based on query
    if (!query) return sites;
    
    const queryLower = query.toLowerCase();
    return sites.filter(site => {
      const siteName = site.name.toLowerCase();
      const siteUrl = site.url.toLowerCase();
      return siteName.includes(queryLower) || siteUrl.includes(queryLower);
    });
  }
};

/**
 * Generate default responses based on user input
 */
function defaultResponse(input: string): string {
  if (input.includes('property') || input.includes('home') || input.includes('house')) {
    return "I can help you find properties that match your requirements. Would you like me to guide you through setting up property alerts or refining your search criteria?";
  } else if (input.includes('service') || input.includes('provider')) {
    return "We have several trusted service providers from legal advisors to movers. You can view them in the service provider tabs. Is there a specific service you're looking for?";
  } else if (input.includes('relocation')) {
    return "Our relocation assistance can help with everything from legal paperwork to finding schools or healthcare. What specific aspect of relocation are you interested in?";
  } else if (input.includes('membership') || input.includes('subscription')) {
    return "Your current membership gives you access to our AI Guardian services, property matching, and service provider network. You can view full details in the membership section.";
  } else if (input.includes('track') || input.includes('monitor')) {
    return "I can help you track property websites for new listings. You can manage your tracked sites in the Site Tracking section. Would you like me to take you there?";
  } else {
    return "I'm here to assist with your property search and relocation needs. I can help with finding suitable properties, connecting you with service providers, or answering questions about relocating to Spain.";
  }
}
