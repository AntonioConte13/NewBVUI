
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Heart, Diamond, Club, Spade, RotateCcw, HelpCircle } from 'lucide-react';
import { TacticalButton } from '../../ui/TacticalButton';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Color = 'red' | 'black';

interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 (Ace) to 13 (King)
  faceUp: boolean;
}

interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: { [key in Suit]: Card[] };
  tableau: Card[][];
  score: number;
  moves: number;
}

interface Selection {
  location: 'waste' | 'tableau' | 'foundation';
  colIndex?: number; // 0-6 for tableau
  cardIndex?: number; // Index in the column/pile
  card: Card;
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

// --- Helpers ---

const getSuitColor = (suit: Suit): Color => (suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black');

const getRankSymbol = (rank: number): string => {
  switch (rank) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return rank.toString();
  }
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(suit => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: false,
      });
    }
  });
  return deck;
};

const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// --- Components ---

const BaseballCardBack: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`w-full h-full rounded-lg border-2 border-gray-300 shadow-sm flex items-center justify-center relative overflow-hidden ${className}`}
    style={{ backgroundColor: '#ffffff' }}
  >
       {/* Baseball Stitching SVG */}
       <svg className="absolute inset-0 w-full h-full text-red-600 opacity-90 pointer-events-none" viewBox="0 0 100 140" preserveAspectRatio="none">
           {/* Left Stitch - Curves inward */}
           <path d="M 25,-10 C 5,40 5,100 25,150" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="6 5" strokeLinecap="round" />
           {/* Right Stitch - Curves inward */}
           <path d="M 75,-10 C 95,40 95,100 75,150" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="6 5" strokeLinecap="round" />
       </svg>
       
       {/* Center Logo */}
       <div className="font-extrabold text-duo-blue opacity-10 text-2xl transform -rotate-12 select-none">
           BV
       </div>
  </div>
);

// --- Main Game Component ---

interface SolitaireGameProps {
  onBack: () => void;
}

export const SolitaireGame: React.FC<SolitaireGameProps> = ({ onBack }) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [won, setWon] = useState(false);

  // --- Init ---
  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (game) {
      checkWinCondition();
    }
  }, [game?.foundations]);

  const startNewGame = () => {
    const deck = shuffle(createDeck());
    
    const tableau: Card[][] = Array(7).fill(null).map(() => []);
    
    // Deal Tableau
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck.pop()!;
        if (i === j) card.faceUp = true; // Top card face up
        tableau[j].push(card);
      }
    }

    setGame({
      stock: deck,
      waste: [],
      foundations: {
        hearts: [],
        diamonds: [],
        clubs: [],
        spades: []
      },
      tableau,
      score: 0,
      moves: 0
    });
    setHistory([]);
    setSelected(null);
    setWon(false);
  };

  const checkWinCondition = () => {
    if (!game) return;
    const totalFoundation = SUITS.reduce((acc, suit) => acc + game.foundations[suit].length, 0);
    if (totalFoundation === 52) {
      setWon(true);
    }
  };

  // --- Logic ---

  const saveHistory = () => {
    if (game) {
      // Deep copy the current game state
      const snapshot = JSON.parse(JSON.stringify(game));
      setHistory(prev => [...prev, snapshot]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const previousState = history[history.length - 1];
    setGame(previousState);
    setHistory(prev => prev.slice(0, -1));
    setSelected(null);
  };

  const handleStockClick = () => {
    if (!game) return;
    saveHistory();
    setSelected(null);

    if (game.stock.length === 0) {
      // Recycle waste to stock
      const newStock = [...game.waste].reverse().map(c => ({ ...c, faceUp: false }));
      setGame({
        ...game,
        stock: newStock,
        waste: [],
        moves: game.moves + 1
      });
    } else {
      // Draw one
      const newStock = [...game.stock];
      const card = newStock.pop()!;
      card.faceUp = true;
      setGame({
        ...game,
        stock: newStock,
        waste: [...game.waste, card],
        moves: game.moves + 1
      });
    }
  };

  const isMoveValid = (source: Card, target: Card | null, type: 'tableau' | 'foundation', targetSuit?: Suit): boolean => {
    if (type === 'foundation') {
      // Move to Foundation
      if (!target) {
        // Empty foundation: Needs Ace
        return source.rank === 1 && source.suit === targetSuit;
      }
      // Building up: Same suit, Rank + 1
      return source.suit === target.suit && source.rank === target.rank + 1;
    } else {
      // Move to Tableau
      if (!target) {
        // Empty column: Needs King
        return source.rank === 13;
      }
      // Building down: Alternating color, Rank - 1
      return getSuitColor(source.suit) !== getSuitColor(target.suit) && source.rank === target.rank - 1;
    }
  };

  const handleCardClick = (card: Card, location: 'waste' | 'tableau' | 'foundation', colIndex?: number, cardIndex?: number) => {
    if (!game) return;

    // If face down in tableau, ignore (unless it's top card reveal logic which is handled in move)
    if (location === 'tableau' && !card.faceUp) return;

    // 1. Deselect if clicking same card
    if (selected?.card.id === card.id) {
      setSelected(null);
      return;
    }

    // 2. If no selection, select this card (if valid source)
    if (!selected) {
      // Can select from waste (top), tableau (any face up), foundation (top)
      if (location === 'foundation') return; // Usually don't move OUT of foundation in simple UI
      
      setSelected({ location, colIndex, cardIndex, card });
      return;
    }

    // 3. If selection exists, try to move TO this card (Tableau only here, Foundation handled in pile click)
    if (location === 'tableau' && colIndex !== undefined) {
      attemptMoveToTableau(colIndex);
    } else {
      // Changed mind, select new card
      setSelected({ location, colIndex, cardIndex, card });
    }
  };

  const handleEmptyTableauClick = (colIndex: number) => {
    if (selected) {
      attemptMoveToTableau(colIndex);
    }
  };

  const handleFoundationClick = (suit: Suit) => {
    if (selected) {
      attemptMoveToFoundation(suit);
    }
  };

  // --- Move Execution ---

  const attemptMoveToTableau = (targetColIndex: number) => {
    if (!game || !selected) return;

    const targetCol = game.tableau[targetColIndex];
    const targetCard = targetCol.length > 0 ? targetCol[targetCol.length - 1] : null;

    // Check validity
    if (isMoveValid(selected.card, targetCard, 'tableau')) {
      executeMove('tableau', targetColIndex);
    } else {
      setSelected(null);
    }
  };

  const attemptMoveToFoundation = (suit: Suit) => {
    if (!game || !selected) return;

    // Can only move single cards to foundation
    if (selected.location === 'tableau') {
      const col = game.tableau[selected.colIndex!];
      if (selected.cardIndex !== col.length - 1) return; // Must be top card
    }

    const pile = game.foundations[suit];
    const targetCard = pile.length > 0 ? pile[pile.length - 1] : null;

    if (isMoveValid(selected.card, targetCard, 'foundation', suit)) {
      executeMove('foundation', undefined, suit);
    } else {
      setSelected(null);
    }
  };

  const executeMove = (targetType: 'tableau' | 'foundation', targetColIdx?: number, targetSuit?: Suit) => {
    if (!game || !selected) return;

    saveHistory();

    // Deep clone to avoid mutation issues with history
    const newGame = JSON.parse(JSON.stringify(game)) as GameState;
    let cardsToMove: Card[] = [];

    // Remove from source
    if (selected.location === 'waste') {
      cardsToMove = [newGame.waste.pop()!];
    } else if (selected.location === 'tableau') {
      const sourceCol = newGame.tableau[selected.colIndex!];
      cardsToMove = sourceCol.splice(selected.cardIndex!);
      
      // Flip new top card
      if (sourceCol.length > 0) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }
    }

    // Add to target
    if (targetType === 'tableau') {
      newGame.tableau[targetColIdx!].push(...cardsToMove);
      newGame.score += 5; // Simple scoring
    } else if (targetType === 'foundation') {
      newGame.foundations[targetSuit!].push(cardsToMove[0]);
      newGame.score += 10;
    }

    newGame.moves += 1;
    setGame(newGame);
    setSelected(null);
  };

  // --- Auto-Move (Double Click) ---
  const handleDoubleClick = (card: Card, location: 'waste' | 'tableau', colIndex?: number) => {
    if (!game) return;
    
    // Can only move top cards automatically
    if (location === 'tableau') {
      const col = game.tableau[colIndex!];
      if (col[col.length - 1].id !== card.id) return; 
    }

    // Check all foundations
    for (const suit of SUITS) {
       const pile = game.foundations[suit];
       const targetCard = pile.length > 0 ? pile[pile.length - 1] : null;
       
       // Check validity directly
       let valid = false;
       if (!targetCard) {
         if (card.rank === 1 && card.suit === suit) valid = true;
       } else {
         if (card.suit === targetCard.suit && card.rank === targetCard.rank + 1) valid = true;
       }

       if (valid) {
          saveHistory();
          
          // Execute move manually to bypass selection state with Deep Clone
          const newGame = JSON.parse(JSON.stringify(game)) as GameState;
          let movedCard: Card;

          if (location === 'waste') {
            movedCard = newGame.waste.pop()!;
          } else {
            const sourceCol = newGame.tableau[colIndex!];
            movedCard = sourceCol.pop()!;
            if (sourceCol.length > 0) sourceCol[sourceCol.length - 1].faceUp = true;
          }

          newGame.foundations[suit].push(movedCard);
          newGame.score += 10;
          newGame.moves += 1;
          setGame(newGame);
          return; // Done
       }
    }
  };

  // --- Render Helpers ---

  const renderCard = (card: Card, location: 'waste' | 'tableau' | 'foundation', colIdx?: number, cardIdx?: number) => {
    const isSelected = selected?.card.id === card.id;
    const color = getSuitColor(card.suit);
    
    // Icon
    const SuitIcon = {
        hearts: Heart,
        diamonds: Diamond,
        clubs: Club,
        spades: Spade
    }[card.suit];

    if (!card.faceUp) {
        return <BaseballCardBack />;
    }

    return (
      <div 
        onClick={(e) => { e.stopPropagation(); handleCardClick(card, location, colIdx, cardIdx); }}
        onDoubleClick={(e) => { 
          e.stopPropagation(); 
          if (location !== 'foundation') {
            handleDoubleClick(card, location, colIdx);
          }
        }}
        style={{ backgroundColor: '#ffffff' }} // Force white background
        className={`
            w-full h-full rounded-lg border-2 relative select-none cursor-pointer transition-transform duration-100
            ${isSelected ? 'border-duo-yellow shadow-[0_0_10px_rgba(250,204,21,0.6)] -translate-y-2 z-50' : 'border-gray-300 shadow-sm'}
            ${color === 'red' ? 'text-red-600' : 'text-black'}
        `}
      >
        <div className="absolute top-1 left-1 text-xs sm:text-sm font-extrabold leading-none flex flex-col items-center">
            <span>{getRankSymbol(card.rank)}</span>
            <SuitIcon size={10} fill={color === 'red' ? "currentColor" : "black"} className="mt-0.5" />
        </div>
        
        {/* Center Art */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <SuitIcon size={32} />
        </div>

        <div className="absolute bottom-1 right-1 text-xs sm:text-sm font-extrabold leading-none rotate-180 flex flex-col items-center">
            <span>{getRankSymbol(card.rank)}</span>
            <SuitIcon size={10} fill={color === 'red' ? "currentColor" : "black"} className="mt-0.5" />
        </div>
      </div>
    );
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-white border-2 border-duo-gray-200 rounded-2xl p-2 shrink-0 z-20">
            <div className="flex items-center gap-2">
                <button onClick={onBack} className="p-2 hover:bg-duo-gray-100 rounded-xl text-duo-gray-500 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-extrabold text-duo-gray-800 leading-none hidden sm:block">Diamond Solitaire</h1>
                    <div className="text-xs font-mono font-bold text-duo-gray-400">
                        MOVES: {game.moves}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 bg-duo-gray-100 px-3 py-1.5 rounded-xl">
                <Trophy size={16} className="text-duo-yellow" />
                <span className="font-extrabold text-duo-gray-800">{game.score}</span>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={handleUndo} 
                    disabled={history.length === 0}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold uppercase transition-colors ${history.length === 0 ? 'text-duo-gray-300 cursor-not-allowed' : 'text-duo-blue bg-duo-blue/10 hover:bg-duo-blue/20'}`}
                    title="Undo Move"
                >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">Undo</span>
                </button>
                <button 
                    onClick={startNewGame} 
                    className="p-2 hover:bg-duo-gray-100 rounded-xl text-duo-gray-500 transition-colors" 
                    title="New Game"
                >
                    <RefreshCw size={20} />
                </button>
            </div>
        </div>

        {/* Game Field */}
        <div className="flex-1 bg-green-700 rounded-3xl shadow-inner border-4 border-green-800 relative overflow-hidden flex flex-col p-4">
            {/* Grass Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>
            
            {/* Chalk Lines */}
            <div className="absolute top-32 left-0 w-full h-1 bg-white/20 pointer-events-none"></div>

            <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full">
                
                {/* Top Row: Stock/Waste & Foundations */}
                <div className="flex justify-between mb-6 sm:mb-8 h-24 sm:h-32">
                    
                    {/* Left: Stock & Waste */}
                    <div className="flex gap-3 sm:gap-6">
                        {/* Stock */}
                        <div 
                            onClick={handleStockClick}
                            className="w-16 sm:w-20 h-24 sm:h-32 rounded-xl border-2 border-white/30 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors relative"
                        >
                            {game.stock.length > 0 ? (
                                <BaseballCardBack />
                            ) : (
                                <RotateCcw className="text-white/40" size={24} />
                            )}
                            <span className="absolute -bottom-6 text-[10px] font-extrabold text-white/60 uppercase tracking-widest">Bullpen</span>
                        </div>

                        {/* Waste */}
                        <div className="w-16 sm:w-20 h-24 sm:h-32 rounded-xl relative">
                             {game.waste.length > 0 && renderCard(game.waste[game.waste.length - 1], 'waste')}
                             <span className="absolute -bottom-6 left-0 w-full text-center text-[10px] font-extrabold text-white/60 uppercase tracking-widest">On Deck</span>
                        </div>
                    </div>

                    {/* Right: Foundations */}
                    <div className="flex gap-2 sm:gap-4">
                        {SUITS.map(suit => (
                            <div 
                                key={suit}
                                onClick={() => handleFoundationClick(suit)}
                                className="w-16 sm:w-20 h-24 sm:h-32 rounded-xl border-2 border-white/30 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative"
                            >
                                {game.foundations[suit].length > 0 ? (
                                    renderCard(game.foundations[suit][game.foundations[suit].length - 1], 'foundation')
                                ) : (
                                    <div className="opacity-30 text-white">
                                        {suit === 'hearts' && <Heart size={24} />}
                                        {suit === 'diamonds' && <Diamond size={24} />}
                                        {suit === 'clubs' && <Club size={24} />}
                                        {suit === 'spades' && <Spade size={24} />}
                                    </div>
                                )}
                                {/* Foundation Base Graphic */}
                                <div className="absolute -z-10 w-full h-full opacity-10 flex items-center justify-center">
                                    <div className="w-10 h-10 rotate-45 border-2 border-white"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Tableau */}
                <div className="flex-1 grid grid-cols-7 gap-2 sm:gap-4 items-start">
                    {game.tableau.map((col, colIndex) => (
                        <div 
                            key={colIndex} 
                            className="min-h-[8rem] relative"
                            onClick={() => handleEmptyTableauClick(colIndex)}
                        >
                            {/* Placeholder Area */}
                            {col.length === 0 && (
                                <div className="w-full h-24 sm:h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5"></div>
                            )}

                            {col.map((card, cardIndex) => (
                                <div 
                                    key={card.id}
                                    className="absolute top-0 left-0 w-full h-24 sm:h-32 transition-all"
                                    style={{ 
                                        top: `${cardIndex * (card.faceUp ? 25 : 10)}px`,
                                        zIndex: cardIndex
                                    }}
                                >
                                    {renderCard(card, 'tableau', colIndex, cardIndex)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </div>

            {/* Win Overlay */}
            <AnimatePresence>
                {won && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md mx-4 border-4 border-duo-yellow">
                            <div className="w-24 h-24 bg-duo-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-duo-yellow animate-bounce">
                                <Trophy size={48} className="text-duo-yellowDark" fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-duo-gray-800 uppercase mb-2">Grand Slam!</h2>
                            <p className="text-duo-gray-500 font-bold mb-6">
                                You cleared the bases in {game.moves} moves.
                            </p>
                            <div className="flex gap-4">
                                <TacticalButton onClick={startNewGame} fullWidth>Play Again</TacticalButton>
                                <TacticalButton onClick={onBack} variant="secondary" fullWidth>Exit</TacticalButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    </div>
  );
};
