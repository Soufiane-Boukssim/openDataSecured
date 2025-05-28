import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-bot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  userInput: string = '';
  chatHistory: ChatMessage[] = [];
  isStreaming: boolean = false;
  streamingMessage: string = '';

  async sendMessage(): Promise<void> {
    const input = this.userInput.trim();
    if (!input) {
      alert('Please enter a message.');
      return;
    }

    // Ajoute le message utilisateur à l'historique
    this.chatHistory.push({ role: 'user', content: input });
    this.userInput = '';

    // Démarre le streaming
    this.isStreaming = true;
    this.streamingMessage = '';

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${environment.openRouterToken}`,
          'HTTP-Referer': 'https://www.sitename.com',
          'X-Title': 'SiteName',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          stream: true,
          messages: this.chatHistory,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

        for (const line of lines) {
          const jsonStr = line.replace(/^data:\s*/, '');
          if (jsonStr === '[DONE]') {
            this.isStreaming = false;
            // Ajouter la réponse complète à l'historique
            this.chatHistory.push({ role: 'assistant', content: fullText });
            return;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const token = parsed.choices?.[0]?.delta?.content || '';
            fullText += token;
            this.streamingMessage = fullText;
          } catch (e) {
            console.error('Erreur parsing JSON du stream:', e);
          }
        }
      }
    } catch (error) {
      this.isStreaming = false;
      this.chatHistory.push({ 
        role: 'assistant', 
        content: 'Error: ' + (error as Error).message 
      });
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  parseMarkdown(text: string): string {
    // Simple markdown parsing - vous pouvez utiliser une bibliothèque comme marked si nécessaire
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}