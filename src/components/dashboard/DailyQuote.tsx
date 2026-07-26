import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const QUOTES: { text: string; author: string }[] = [
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "Somewhere, someone busier than you is training right now.", author: "Unknown" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
  { text: "It never gets easier, you just get better.", author: "Jordan Hoechlin" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "You are one workout away from a good mood.", author: "Unknown" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Fall in love with the process and the results will come.", author: "Eric Thomas" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "George Lorimer" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
  { text: "Sweat is just fat crying.", author: "Unknown" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "The only person you should try to be better than is who you were yesterday.", author: "Unknown" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John Maxwell" },
  { text: "Train insane or remain the same.", author: "Jillian Michaels" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
];

export function DailyQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!quote) return null;

  return (
    <div className="relative mx-auto mt-8 max-w-3xl rounded-lg border border-primary/30 bg-card/60 p-4 backdrop-blur">
      <div className="flex items-start gap-3">
        <Quote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground md:text-base">"{quote.text}"</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}