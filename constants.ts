
import { Drill, CertModule, SquadMember, QuizQuestion, CustomQuiz, LeagueParticipant, SocialPost, SavedCollection } from './types';

// Placeholder for the BVAI Logo. Replace this URL with your actual uploaded image path.
const BVAI_LOGO_THUMBNAIL = 'https://placehold.co/600x400/111827/DC2626?text=BVAI';
const VIDEO_THUMB_1 = 'https://placehold.co/600x400/1f2937/DC2626?text=Bullpen+Session';
const VIDEO_THUMB_2 = 'https://placehold.co/600x400/1f2937/DC2626?text=Cage+Work';

export const DRILLS: Drill[] = [
  {
    id: 'd1',
    title: 'Three Pump Drill',
    category: 'Pitching',
    subcategory: 'Balance Phase',
    difficulty: 'Veteran',
    duration: '15 min',
    description: 'Develops balance, stability, and proper timing of hand separation while staying above the rubber.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
      'Start from set position.',
      'Execute knee-drop and hand-break 3 times.',
      'Break hands thumb-to-thigh as knee falls.',
      'Throw on third rep.'
    ],
    coachingPoints: [
      'Stay in a phone booth',
      'Front knee must fall before momentum begins',
      'Keep hips closed'
    ],
    // Enhanced Data
    whyItMatters: 'This drill isolates the "gather" phase of the delivery. Biomechanically, it syncs the lower half\'s vertical drop with the upper half\'s hand separation. This prevents "rushing" (hips flying open too early) and ensures the arm is in the correct slot when foot strike occurs, maximizing potential energy.',
    commonMistakes: [
      {
        mistake: 'Leaking Forward Early',
        correction: 'Cue: "Stay inside your back knee." Visual: Imagine a glass wall in front of your nose until the 3rd pump.'
      },
      {
        mistake: 'Hands Breaking High',
        correction: 'Cue: "Thumbs to thigh." Hands must separate downwards as the knee drops, not outwards.'
      },
      {
        mistake: 'Opening Front Shoulder',
        correction: 'Cue: "Show your numbers to the catcher." Keep the lead shoulder pointed at the target longer.'
      }
    ],
    variations: {
      regression: 'Perform the 3 pumps without throwing the ball. Focus purely on the balance point hold.',
      progression: 'Perform off the mound (slope) to challenge stability, or add a "drive" phase where the pitcher explodes out after the 3rd pump.',
      nextDrillId: 'd2'
    },
    assessment: {
      checkpoints: [
        'Head stays centered over back hip during pumps',
        'Hand break occurs simultaneously with knee drop',
        'Front foot lands closed (slightly internal rotation)'
      ],
      readyToProgress: 'Athlete can execute 8/10 reps maintaining a consistent spine angle without "falling" towards the plate.'
    },
    context: {
      season: 'Pre-Season & In-Season Maintenance',
      placement: 'Bullpen warm-up (middle phase) or Mechanical Correction block.',
      gameSituations: ['Pitcher struggling with command', 'Pitcher "flying open" or missing high arm-side']
    }
  },
  {
    id: 'd2',
    title: 'Flamingo Catch and Toss',
    category: 'Pitching',
    subcategory: 'Stability',
    difficulty: 'Recruit',
    duration: '10 min',
    description: 'Enhances balance and stability above the rubber by challenging control on the back leg.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
      'Stand on back leg, front knee lifted.',
      'Coach throws 3 balls in different directions.',
      'Catch, stabilize, then throw.'
    ],
    coachingPoints: [
      'Maintain core engagement',
      'Focus on single-leg stability'
    ]
  },
  {
    id: 'd3',
    title: 'Transfer Progression #1 (Barehand)',
    category: 'Catching',
    subcategory: 'Throwing',
    difficulty: 'Recruit',
    duration: '15 min',
    description: 'Isolates upper body movement to focus on smooth, bare-handed transfers.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: true,
    steps: [
      'Start on two knees.',
      'Let ball get deep.',
      'Rotate upper body.',
      'Finish with ball behind ear.'
    ],
    coachingPoints: [
        'Soft hands',
        'Quick rotation'
    ]
  },
  {
    id: 'd4',
    title: 'Primary Stance (No Runners)',
    category: 'Catching',
    subcategory: 'Stance',
    difficulty: 'Recruit',
    duration: '10 min',
    description: 'Deep position, sitting further back on heels to lower eye level. Used when blocking is not a priority.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
        'Establish deep squat position.',
        'Sit back on heels.',
        'Lower eye level to strike zone.',
        'Relax receiving arm.'
    ],
    coachingPoints: [
      'Left foot slightly in front',
      'Maximize receiving ability',
      'Low center of gravity'
    ]
  },
  {
    id: 'd5',
    title: 'Tee Routine: High & Low',
    category: 'Hitting',
    subcategory: 'Zone Control',
    difficulty: 'Recruit',
    duration: '20 min',
    description: 'Focuses on maintaining barrel path through different elevations of the strike zone.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
        'Set tee to top of strike zone.',
        'Drive ball to back of net (10 reps).',
        'Set tee to knees.',
        'Drive ball to back of net (10 reps).'
    ],
    coachingPoints: [
      'Stay connected',
      'Don\'t collapse backside on low pitch',
      'Keep hands above ball'
    ]
  },
  {
    id: 'd6',
    title: 'Short Hop Series',
    category: 'Infield',
    subcategory: 'Glove Work',
    difficulty: 'Veteran',
    duration: '15 min',
    description: 'Develops soft hands and the ability to pick balls through the hop.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
        'Partner rolls firm grounders.',
        'Field straight on (Forehand).',
        'Field backhand.',
        'Field short hop pick.'
    ],
    coachingPoints: [
      'Work from ground up',
      'Press through the ball',
      'Eyes behind the glove'
    ]
  },
  {
    id: 'd7',
    title: 'Drop Step & Go',
    category: 'Outfield',
    subcategory: 'Agility',
    difficulty: 'Recruit',
    duration: '15 min',
    description: 'Fundamental first-step explosiveness for tracking fly balls overhead.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
        'Start in athletic stance.',
        'Coach points direction.',
        'Execute drop step.',
        'Sprint 10 yards looking back.'
    ],
    coachingPoints: [
      'Do not cross feet',
      'Gain ground immediately',
      'Tuck glove'
    ]
  },
  {
    id: 'd8',
    title: 'Base Stealing: First Step',
    category: 'Base-running',
    subcategory: 'Explosion',
    difficulty: 'Elite',
    duration: '10 min',
    description: 'Maximizing the first two steps of the steal break to generate peak momentum.',
    thumbnail: BVAI_LOGO_THUMBNAIL,
    completed: false,
    steps: [
        'Assume lead-off stance.',
        'React to visual cue (pitcher lift).',
        'Drive lead arm and crossover step.',
        'Stay low for 10 yards.'
    ],
    coachingPoints: [
      'Drive off both feet',
      'Low center of gravity',
      'Violent arm action'
    ]
  }
];

// --- CERTIFICATION MODULES (TRIPLED PATHWAY) ---

export const CERT_PATH: CertModule[] = [
  // --- ROUND 1: FOUNDATIONS (Recruit) ---
  {
    id: 'm1',
    title: 'Hitting 101',
    description: 'Stance, load, balance, and eye focus mechanics.',
    status: 'active',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm2',
    title: 'Pitching 101',
    description: 'Windup, power position, grip, and follow-through.',
    status: 'locked',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm3',
    title: 'Catching 101',
    description: 'Stance, framing, blocking, and communication.',
    status: 'locked',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm4',
    title: 'Baserunning 101',
    description: 'Leads, stealing, rounding bases, and sliding.',
    status: 'locked',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm5',
    title: 'Infielding 101',
    description: 'Ready position, approach, and glove work.',
    status: 'locked',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm6',
    title: 'Outfielding 101',
    description: 'Drop steps, trajectory judgment, and crow hops.',
    status: 'locked',
    xpReward: 500,
    iconType: 'quiz',
  },
  {
    id: 'm7',
    title: 'Practice Planning I',
    description: 'Warm-ups, station drills, and time management.',
    status: 'locked',
    xpReward: 750,
    iconType: 'quiz',
  },
  {
    id: 'm8',
    title: 'Philosophy I',
    description: 'Reinforcement, sportsmanship, and motivation.',
    status: 'locked',
    xpReward: 750,
    iconType: 'quiz',
  },
  {
    id: 'm9',
    title: 'Strategy I',
    description: 'Shifts, pickoffs, and basic situational hitting.',
    status: 'locked',
    xpReward: 1000,
    iconType: 'quiz',
  },
  {
    id: 'm10',
    title: 'Safety I',
    description: 'Stretching, equipment, and concussion protocols.',
    status: 'locked',
    xpReward: 1000,
    iconType: 'trophy',
  },

  // --- ROUND 2: APPLICATION (Veteran) ---
  {
    id: 'm11',
    title: 'Hitting 201',
    description: 'Count leverage, off-speed adjustments, and opposite field.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm12',
    title: 'Pitching 201',
    description: 'Pitch sequencing, changing speeds, and holding runners.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm13',
    title: 'Catching 201',
    description: 'Calling a game, handling cross-ups, and throwing from knees.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm14',
    title: 'Baserunning 201',
    description: 'Reading dirt balls, delayed steals, and 1st & 3rd situations.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm15',
    title: 'Infielding 201',
    description: 'Double play feeds, slow rollers, and relay positioning.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm16',
    title: 'Outfielding 201',
    description: 'Fence communication, diving mechanics, and shoestring catches.',
    status: 'locked',
    xpReward: 1250,
    iconType: 'quiz',
  },
  {
    id: 'm17',
    title: 'Practice Planning II',
    description: 'Season-long development arcs and simulated games.',
    status: 'locked',
    xpReward: 1500,
    iconType: 'quiz',
  },
  {
    id: 'm18',
    title: 'Philosophy II',
    description: 'Mental skills coaching, routine building, and slump busting.',
    status: 'locked',
    xpReward: 1500,
    iconType: 'quiz',
  },
  {
    id: 'm19',
    title: 'Strategy II',
    description: 'Bunt defenses, cut-offs, and double switches.',
    status: 'locked',
    xpReward: 1750,
    iconType: 'quiz',
  },
  {
    id: 'm20',
    title: 'Safety II',
    description: 'Arm care programs, heat illness, and recovery protocols.',
    status: 'locked',
    xpReward: 1750,
    iconType: 'trophy',
  },

  // --- ROUND 3: MASTERY (Elite) ---
  {
    id: 'm21',
    title: 'Hitting 301',
    description: 'Kinetic chain sequencing, launch angle, and bat sensor data.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm22',
    title: 'Pitching 301',
    description: 'Tunneling, spin efficiency, and Rapsodo/Trackman analysis.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm23',
    title: 'Catching 301',
    description: 'Advanced receiving metrics and managing a pitching staff.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm24',
    title: 'Baserunning 301',
    description: 'Scouting pick-off moves and calculating risk/reward ratios.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm25',
    title: 'Infielding 301',
    description: 'Defensive runs saved (DRS), advanced shifting, and reading hops.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm26',
    title: 'Outfielding 301',
    description: 'Route efficiency, sun management, and do-or-die plays.',
    status: 'locked',
    xpReward: 2000,
    iconType: 'quiz',
  },
  {
    id: 'm27',
    title: 'Practice Planning III',
    description: 'Individualized player development plans (IDPs) and load management.',
    status: 'locked',
    xpReward: 2500,
    iconType: 'quiz',
  },
  {
    id: 'm28',
    title: 'Philosophy III',
    description: 'Culture building, leadership councils, and conflict resolution.',
    status: 'locked',
    xpReward: 2500,
    iconType: 'quiz',
  },
  {
    id: 'm29',
    title: 'Strategy III',
    description: 'Sabermetrics application, spray charts, and matchup analysis.',
    status: 'locked',
    xpReward: 3000,
    iconType: 'quiz',
  },
  {
    id: 'm30',
    title: 'Safety III',
    description: 'Biomechanical screening and long-term athletic development (LTAD).',
    status: 'locked',
    xpReward: 5000,
    iconType: 'trophy',
  },
];

// --- BVSA QUIZ DATABASE (EXTENDED) ---

export const BVSA_QUIZZES: Record<string, { title: string, questions: QuizQuestion[] }> = {
  // --- ROUND 1 ---
  'm1': {
    title: 'Module 1: Hitting Mechanics',
    questions: [
      { id: 'h1', question: 'What is the most important initial body position for a successful baseball swing?', options: ['Leaning backward', 'Balanced and athletic stance', 'Kneeling', 'Standing upright and stiff'], correctAnswer: 1 },
      { id: 'h2', question: 'Which part of the bat should make contact with the ball for ideal results?', options: ['The handle', 'The cap', 'The "sweet spot" (barrel)', 'The knob'], correctAnswer: 2 },
      { id: 'h3', question: 'What is "load" in hitting mechanics?', options: ['A weight shift back/negative move to gather energy', 'Lifting the bat over your head', 'Stepping forward immediately', 'Closing your eyes'], correctAnswer: 0 },
      { id: 'h4', question: 'Why is balance necessary during the swing?', options: ['It looks better', 'To allow for controlled power and consistency', 'To run faster to first base', 'To confuse the pitcher'], correctAnswer: 1 },
      { id: 'h5', question: 'What role does eye focus play before the pitch?', options: ['Watching the crowd', 'Picking up the release point early', 'Staring at the catcher', 'Looking at the bat'], correctAnswer: 1 }
    ]
  },
  'm2': {
    title: 'Module 2: Pitching Mechanics',
    questions: [
      { id: 'p1', question: 'What is the primary goal of the pitcher’s windup?', options: ['To distract the batter', 'To establish rhythm and timing', 'To waste time', 'To hide the ball forever'], correctAnswer: 1 },
      { id: 'p2', question: 'Why is stride length important for velocity and control?', options: ['It allows for full extension and energy transfer', 'It makes you look taller', 'It shortens the distance to home significantly', 'It prevents the batter from swinging'], correctAnswer: 0 },
      { id: 'p3', question: 'What is the "power position" in pitching mechanics?', options: ['Standing straight up', 'Scapular load with separation of hands', 'Sitting on the bench', 'Holding the ball high above head'], correctAnswer: 1 },
      { id: 'p4', question: 'How does proper grip affect pitch movement?', options: ['It changes the color of the ball', 'It determines spin axis and rotation', 'It makes the ball heavier', 'It has no effect'], correctAnswer: 1 },
      { id: 'p5', question: 'Why is follow-through essential?', options: ['To look cool for the camera', 'To safely decelerate the arm and prevent injury', 'To field ground balls only', 'To taunt the batter'], correctAnswer: 1 }
    ]
  },
  'm3': {
    title: 'Module 3: Catching Basics',
    questions: [
      { id: 'c1', question: 'What stance should a catcher use when receiving a fastball with no runners on?', options: ['Primary Stance (Athletic/Relaxed)', 'Secondary Stance (Ready to throw)', 'Kneeling on both knees upright', 'Standing'], correctAnswer: 0 },
      { id: 'c2', question: 'Why does a catcher "frame" the pitch?', options: ['To catch the ball faster', 'To present the pitch as a strike to the umpire', 'To hide the ball from the pitcher', 'To trick the batter'], correctAnswer: 1 },
      { id: 'c3', question: 'How does a catcher block a ball in the dirt?', options: ['By kicking it', 'By dropping knees and keeping chest over the ball', 'By using the glove only', 'By dodging it'], correctAnswer: 1 },
      { id: 'c4', question: 'What is the correct hand placement for catching with two hands?', options: ['Bare hand behind the back or glove', 'Both hands in front of the face', 'Bare hand on the ground', 'Holding the batter'], correctAnswer: 0 },
      { id: 'c5', question: 'Why is communication with pitchers key for catchers?', options: ['To discuss dinner plans', 'To build confidence and navigate the lineup', 'To distract the umpire', 'To annoy the batter'], correctAnswer: 1 }
    ]
  },
  'm4': {
    title: 'Module 4: Baserunning Basics',
    questions: [
      { id: 'b1', question: 'What is the benefit of a good base-running lead?', options: ['It shortens the distance to the next base', 'It allows you to talk to the first baseman', 'It looks professional', 'It blocks the view of the umpire'], correctAnswer: 0 },
      { id: 'b2', question: 'What cues should a runner watch to time a steal?', options: ['The crowd noise', 'The pitcher’s heel lift or shoulder turn', 'The catcher’s glove', 'The third base coach only'], correctAnswer: 1 },
      { id: 'b3', question: 'How can a runner maximize speed while rounding a base?', options: ['Run in a wide circle', 'Use a "question mark" turn and touch the inside corner', 'Stop at the base', 'Jump over the base'], correctAnswer: 1 },
      { id: 'b4', question: 'Why is sliding sometimes necessary?', options: ['To clean your uniform', 'To avoid a tag and stop momentum at the base', 'To hurt the fielder', 'To rest'], correctAnswer: 1 },
      { id: 'b5', question: 'What is "tagging up"?', options: ['Touching the base after a fly ball is caught before advancing', 'High-fiving the coach', 'Touching the runner ahead of you', 'Stealing home'], correctAnswer: 0 }
    ]
  },
  'm5': {
    title: 'Module 5: Infielding Basics',
    questions: [
      { id: 'i1', question: 'What is the "ready position" for infielders?', options: ['Standing tall with arms crossed', 'Athletic stance, knees bent, glove out in front', 'Sitting on the grass', 'Leaning on one leg'], correctAnswer: 1 },
      { id: 'i2', question: 'How should an infielder approach a ground ball?', options: ['Wait for it to stop', 'Charge under control, Right-Left-Field', 'Run away from it', 'Dive immediately'], correctAnswer: 1 },
      { id: 'i3', question: 'Why is "two hands" used for fielding?', options: ['It is required by law', 'To secure the catch and allow for a quicker transfer', 'To keep hands warm', 'To look old school'], correctAnswer: 1 },
      { id: 'i4', question: 'What is a "short hop" and how do you field it?', options: ['A high bounce; jump for it', 'A ball bouncing near the feet; push through with soft hands', 'A slow roller; wait for it', 'A fly ball'], correctAnswer: 1 },
      { id: 'i5', question: 'Describe the footwork for making a quick throw.', options: ['Stay planted', 'Shuffle momentum towards the target', 'Spin in a circle', 'Jump in the air'], correctAnswer: 1 }
    ]
  },
  'm6': {
    title: 'Module 6: Outfielding Basics',
    questions: [
      { id: 'o1', question: 'What is the first reaction to a fly ball over your head?', options: ['Run forward', 'Execute a drop step', 'Backpedal', 'Duck'], correctAnswer: 1 },
      { id: 'o2', question: 'How do outfielders judge the trajectory of the ball?', options: ['By guessing', 'Reading the angle and speed off the bat', 'Waiting for it to land', 'Asking the shortstop'], correctAnswer: 1 },
      { id: 'o3', question: 'Why use a "crow hop" for throwing from the outfield?', options: ['To scare the runner', 'To generate momentum and power', 'To hop over the fence', 'To celebrate'], correctAnswer: 1 },
      { id: 'o4', question: 'What’s the correct backup procedure for outfielders?', options: ['Stand still', 'Move behind the base where the ball is being thrown', 'Run to the dugout', 'Sit down'], correctAnswer: 1 },
      { id: 'o5', question: 'How does an outfielder communicate with teammates?', options: ['Texting', 'Calling "I got it" or "Ball, Ball, Ball"', 'Waving silently', 'Whistling'], correctAnswer: 1 }
    ]
  },
  'm7': {
    title: 'Module 7: Practice Planning I',
    questions: [
      { id: 'pp1', question: 'What is an effective warm-up sequence?', options: ['Sprinting immediately', 'Dynamic stretching and activation', 'Static stretching only', 'Batting practice'], correctAnswer: 1 },
      { id: 'pp2', question: 'Why include station drills in practice plans?', options: ['To confuse players', 'To maximize reps and engagement', 'To make practice longer', 'To separate friends'], correctAnswer: 1 },
      { id: 'pp3', question: 'How do you ensure every player gets meaningful reps?', options: ['Use small groups and minimize standing around', 'Let the best players hit only', 'Talk for an hour', 'Scrimmage only'], correctAnswer: 0 },
      { id: 'pp4', question: 'What’s a good ratio between instruction and live play?', options: ['100% Instruction', 'Brief instruction, maximum execution', '100% Live play', '50/50 always'], correctAnswer: 1 },
      { id: 'pp5', question: 'How do you adjust practices for different skill levels?', options: ['You don\'t', 'Use regressions and progressions for drills', 'Tell them to get better', 'Cancel practice'], correctAnswer: 1 }
    ]
  },
  'm8': {
    title: 'Module 8: Coaching Philosophy',
    questions: [
      { id: 'cp1', question: 'What does "positive reinforcement" look like in baseball?', options: ['Yelling at errors', 'Praising effort and correcting technique constructively', 'Ignoring the players', 'Only cheering for wins'], correctAnswer: 1 },
      { id: 'cp2', question: 'Why is sportsmanship vital for team culture?', options: ['It isn\'t', 'It builds respect and integrity', 'It makes the other team lose', 'It looks good on TV'], correctAnswer: 1 },
      { id: 'cp3', question: 'How should a coach manage disagreements with parents?', options: ['Argue in public', 'Set clear boundaries and communicate privately', 'Ignore them', 'Quit'], correctAnswer: 1 },
      { id: 'cp4', question: 'What’s the best way to motivate young athletes?', options: ['Fear', 'Fun, improvement, and attainable goals', 'Money', 'Punishment'], correctAnswer: 1 },
      { id: 'cp5', question: 'What is "player-centric" coaching?', options: ['Doing what the coach wants', 'Prioritizing player development over winning at all costs', 'Letting players do whatever they want', 'Only coaching the stars'], correctAnswer: 1 }
    ]
  },
  'm9': {
    title: 'Module 9: Advanced Strategy',
    questions: [
      { id: 'as1', question: 'What is a situation for defensive shifts?', options: ['When you are bored', 'Based on hitter tendencies/spray charts', 'Every inning', 'Never'], correctAnswer: 1 },
      { id: 'as2', question: 'How do pickoff moves help pitchers?', options: ['They control the running game and disrupt timing', 'They rest the arm', 'They annoy the umpire', 'They end the inning automatically'], correctAnswer: 0 },
      { id: 'as3', question: 'When to use a bunt for advancing runners?', options: ['With 2 strikes', 'In a close game with a runner on 1st/2nd and < 2 outs', 'When leading by 10 runs', 'Home run derby'], correctAnswer: 1 },
      { id: 'as4', question: 'What is "situational hitting"?', options: ['Trying to hit a home run every time', 'Adjusting approach (e.g., hitting behind the runner) based on game state', 'Closing eyes and swinging', 'Bunting only'], correctAnswer: 1 },
      { id: 'as5', question: 'Why teach multiple positions to youth players?', options: ['To confuse them', 'To develop versatility and baseball IQ', 'Because you lack players', 'To make them tired'], correctAnswer: 1 }
    ]
  },
  'm10': {
    title: 'Module 10: Safety & Injury Prevention',
    questions: [
      { id: 'sip1', question: 'What’s the purpose of dynamic stretching?', options: ['To sleep', 'To increase blood flow and muscle temperature before activity', 'To cool down', 'To look flexible'], correctAnswer: 1 },
      { id: 'sip2', question: 'How do helmets protect players during batting?', options: ['They don\'t', 'They absorb impact and prevent head trauma', 'They look cool', 'They keep the sun out'], correctAnswer: 1 },
      { id: 'sip3', question: 'What signs may indicate a possible concussion?', options: ['Hunger', 'Dizziness, nausea, confusion, sensitivity to light', 'Excitement', 'Sweating'], correctAnswer: 1 },
      { id: 'sip4', question: 'How should a coach respond to heat exhaustion symptoms?', options: ['Keep playing', 'Hydrate, move to shade, stop activity immediately', 'Run laps', 'Ignore it'], correctAnswer: 1 },
      { id: 'sip5', question: 'Why teach proper sliding technique?', options: ['To prevent ankle/knee injuries and collisions', 'To dirty the uniform', 'To get there slower', 'To scare the infielder'], correctAnswer: 0 }
    ]
  },

  // --- ROUND 2 ---
  'm11': {
    title: 'Module 11: Hitting 201',
    questions: [
      { id: 'h2-1', question: 'With 2 strikes, what is the primary physical adjustment?', options: ['Swing harder', 'Choke up and widen stance', 'Close eyes', 'Step towards the dugout'], correctAnswer: 1 },
      { id: 'h2-2', question: 'What is the goal when hitting behind the runner (Runner on 2nd)?', options: ['Hit a pop up', 'Pull the ball to the right side', 'Strike out', 'Bunt'], correctAnswer: 1 },
      { id: 'h2-3', question: 'How do you adjust to a slower pitcher?', options: ['Start later or hold the load longer', 'Swing faster', 'Step early', 'Use a heavier bat'], correctAnswer: 0 },
      { id: 'h2-4', question: 'What does "hunting the fastball" mean?', options: ['Looking for a walk', 'Sitting on a specific pitch/zone early in the count', 'Running after the ball', 'Swinging at everything'], correctAnswer: 1 },
      { id: 'h2-5', question: 'Where should your eyes be during the pitcher\'s windup?', options: ['The catcher', 'The release point window', 'The pitcher\'s feet', 'The scoreboard'], correctAnswer: 1 }
    ]
  },
  'm12': {
    title: 'Module 12: Pitching 201',
    questions: [
      { id: 'p2-1', question: 'What is "sequencing"?', options: ['Throwing in alphabetical order', 'The strategic order of pitches to disrupt timing', 'Throwing only fastballs', 'Counting pitches'], correctAnswer: 1 },
      { id: 'p2-2', question: 'When is a changeup most effective?', options: ['When the batter expects a fastball', 'When the batter is bunting', 'After a curveball', 'On a 3-0 count'], correctAnswer: 0 },
      { id: 'p2-3', question: 'What is the purpose of a slide step?', options: ['To look cool', 'To reduce time to the plate with runners on base', 'To throw faster', 'To confuse the umpire'], correctAnswer: 1 },
      { id: 'p2-4', question: 'How do you establish the inside part of the plate?', options: ['Yell at the batter', 'Throw fastballs inside to move the batter\'s feet', 'Hit the batter', 'Throw curveballs'], correctAnswer: 1 },
      { id: 'p2-5', question: 'What is the "eye level" concept?', options: ['Throwing at the head', 'Changing the vertical plane of pitches (High FB vs Low Curve)', 'Looking at the batter', 'Wearing sunglasses'], correctAnswer: 1 }
    ]
  },
  'm13': {
    title: 'Module 13: Catching 201',
    questions: [
      { id: 'c2-1', question: 'When should a catcher utilize the "secondary stance"?', options: ['Always', 'With runners on base or 2 strikes', 'Only in the bullpen', 'Never'], correctAnswer: 1 },
      { id: 'c2-2', question: 'What is a "cross-up"?', options: ['When the pitcher throws a different pitch than called', 'A type of bat', 'A fielding error', 'A verbal argument'], correctAnswer: 0 },
      { id: 'c2-3', question: 'How do you block a ball to your right?', options: ['Backhand it', 'Slide hips right, drive right knee down, glove fills the 5-hole', 'Jump right', 'Kick it'], correctAnswer: 1 },
      { id: 'c2-4', question: 'What is the priority on a play at the plate?', options: ['Blocking the plate illegally', 'Securing the ball before applying the tag', 'Yelling at the runner', 'Dropping the mask'], correctAnswer: 1 },
      { id: 'c2-5', question: 'Why throw from the knees?', options: ['It is lazy', 'For quicker release on steals if arm strength allows', 'It is illegal', 'To save energy'], correctAnswer: 1 }
    ]
  },
  'm14': {
    title: 'Module 14: Baserunning 201',
    questions: [
      { id: 'b2-1', question: 'What is a "dirt ball read"?', options: ['Reading a book', 'Advancing immediately when a pitch hits the dirt', 'Cleaning the ball', 'Looking at the ground'], correctAnswer: 1 },
      { id: 'b2-2', question: 'When executing a delayed steal, when do you break?', options: ['On first movement', 'As the catcher throws the ball back to the pitcher', 'When the umpire blinks', 'Before the pitch'], correctAnswer: 1 },
      { id: 'b2-3', question: 'On a fly ball to deep right field, a runner on 2nd should:', options: ['Run immediately', 'Tag up and watch the catch', 'Go halfway', 'Sit down'], correctAnswer: 1 },
      { id: 'b2-4', question: 'What is the rule for running out of the baseline?', options: ['You are out if avoiding a tag (more than 3ft)', 'You can run anywhere', 'It is a foul', 'You get two bases'], correctAnswer: 0 },
      { id: 'b2-5', question: 'In a 1st & 3rd situation, what is the runner on 1st\'s job?', options: ['Draw a throw to allow the runner on 3rd to score', 'Stand still', 'Get out', 'Steal home'], correctAnswer: 0 }
    ]
  },
  'm15': {
    title: 'Module 15: Infielding 201',
    questions: [
      { id: 'i2-1', question: 'On a double play ball, how should the shortstop feed second base?', options: ['Overhand throw', 'Underhand flip near the bag', 'Roll it', 'Kick it'], correctAnswer: 1 },
      { id: 'i2-2', question: 'How do you field a "slow roller"?', options: ['Wait for it', 'Charge hard, field off left foot (righty), throw on run', 'Dive', 'Let it go foul'], correctAnswer: 1 },
      { id: 'i2-3', question: 'Who is the cutoff man on a ball to the right-center gap?', options: ['Third baseman', 'Second baseman', 'Shortstop', 'Pitcher'], correctAnswer: 1 },
      { id: 'i2-4', question: 'What is "covering the bag"?', options: ['Putting a tarp on it', 'Being at the base to receive a throw', 'Standing on top of it', 'Hiding it'], correctAnswer: 1 },
      { id: 'i2-5', question: 'When should the infield play "in"?', options: ['Runner on 3rd, < 2 outs, close game', 'Bases empty', '2 outs', 'Runner on 1st'], correctAnswer: 0 }
    ]
  },
  'm16': {
    title: 'Module 16: Outfielding 201',
    questions: [
      { id: 'o2-1', question: 'When approaching the fence for a fly ball, what should you do?', options: ['Run into it full speed', 'Feel for the warning track', 'Close your eyes', 'Jump early'], correctAnswer: 1 },
      { id: 'o2-2', question: 'What is the "do or die" play?', options: ['Giving up', 'Charging a grounder to throw a runner out at home', 'Walking off the field', 'Bunting'], correctAnswer: 1 },
      { id: 'o2-3', question: 'How do you communicate on a ball in the gap?', options: ['Stay silent', 'Loudly call "Ball" or "Take it"', 'Use hand signals', 'Look at the coach'], correctAnswer: 1 },
      { id: 'o2-4', question: 'Why keep throws "low and through the cutoff"?', options: ['It looks better', 'To allow the cutoff to intercept if needed', 'To bounce it', 'To hurt the cutoff man'], correctAnswer: 1 },
      { id: 'o2-5', question: 'What is shading?', options: ['Standing under a tree', 'Adjusting positioning based on hitter tendencies', 'Wearing sunglasses', 'Ignoring the ball'], correctAnswer: 1 }
    ]
  },
  'm17': {
    title: 'Module 17: Practice Planning II',
    questions: [
      { id: 'pp2-1', question: 'What is a "simulated game"?', options: ['A video game', 'Live pitchers vs hitters in a controlled environment', 'Watching baseball on TV', 'Running bases only'], correctAnswer: 1 },
      { id: 'pp2-2', question: 'Why vary practice intensity throughout the week?', options: ['To confuse players', 'To manage fatigue and peak for game day', 'It does not matter', 'To save money'], correctAnswer: 1 },
      { id: 'pp2-3', question: 'What is the benefit of small-sided games?', options: ['Less fun', 'More touches/reps per player', 'Takes longer', 'Requires more space'], correctAnswer: 1 },
      { id: 'pp2-4', question: 'How do you handle rain delays in practice?', options: ['Go home', 'Have an indoor contingency plan (chalk talk, gym)', 'Sit in the rain', 'Cancel the season'], correctAnswer: 1 },
      { id: 'pp2-5', question: 'What is a "post-practice debrief"?', options: ['Leaving immediately', 'Reviewing what went well and what needs work', 'Eating', 'Cleaning gear'], correctAnswer: 1 }
    ]
  },
  'm18': {
    title: 'Module 18: Philosophy II',
    questions: [
      { id: 'ph2-1', question: 'What is a "growth mindset"?', options: ['Believing talent is fixed', 'Believing abilities can be developed through dedication', 'Ignoring failure', 'Only winning matters'], correctAnswer: 1 },
      { id: 'ph2-2', question: 'How do routines help athletes?', options: ['They make them boring', 'They provide comfort and consistency in high pressure', 'They waste time', 'They reduce skill'], correctAnswer: 1 },
      { id: 'ph2-3', question: 'What is the best way to handle a "slump"?', options: ['Quit', 'Focus on process over results', 'Change stance every pitch', 'Blame the umpire'], correctAnswer: 1 },
      { id: 'ph2-4', question: 'Why is body language important?', options: ['It isn\'t', 'It communicates confidence or defeat to opponents/teammates', 'To look good for scouts', 'To scare the ball'], correctAnswer: 1 },
      { id: 'ph2-5', question: 'What is "controlling the controllables"?', options: ['Focusing on effort and attitude, not the umpire or weather', 'Controlling the score', 'Controlling the other team', 'Controlling time'], correctAnswer: 0 }
    ]
  },
  'm19': {
    title: 'Module 19: Strategy II',
    questions: [
      { id: 'st2-1', question: 'What is the "wheel play" used for?', options: ['Changing tires', 'Defending a bunt with runners on 1st and 2nd', 'Running bases', 'Pitching rotation'], correctAnswer: 1 },
      { id: 'st2-2', question: 'Why use a "double switch"?', options: ['To confuse the scorer', 'To improve defense and change the batting order slot for the pitcher', 'To use two balls', 'To switch dugouts'], correctAnswer: 1 },
      { id: 'st2-3', question: 'When should you issue an intentional walk?', options: ['First inning', 'Base open, dangerous hitter, force play needed', 'Bases loaded', 'Never'], correctAnswer: 1 },
      { id: 'st2-4', question: 'What is a "suicide squeeze"?', options: ['A dangerous slide', 'Runner on 3rd breaks on pitch, batter must bunt', 'Bunting for a hit', 'Stealing home'], correctAnswer: 1 },
      { id: 'st2-5', question: 'What is the "infield fly rule"?', options: ['Fly balls don\'t count', 'Prevents defense from dropping ball to turn double play', 'Outfielders can\'t catch it', 'Batter runs to 2nd'], correctAnswer: 1 }
    ]
  },
  'm20': {
    title: 'Module 20: Safety II',
    questions: [
      { id: 'sf2-1', question: 'What is the purpose of a pitch count limit?', options: ['To make games shorter', 'To prevent overuse injuries in arms', 'To annoy pitchers', 'To save baseballs'], correctAnswer: 1 },
      { id: 'sf2-2', question: 'How do you treat early signs of heat illness?', options: ['Push through it', 'Cool down immediately, hydrate, stop activity', 'Run faster', 'Wear a jacket'], correctAnswer: 1 },
      { id: 'sf2-3', question: 'Why is arm care (J-Bands) important?', options: ['It looks cool', 'To strengthen the rotator cuff and stabilizers', 'To stretch the legs', 'It isn\'t'], correctAnswer: 1 },
      { id: 'sf2-4', question: 'What is the first step if a player collapses?', options: ['Check for response/breathing (Call 911)', 'Drag them off field', 'Give them water', 'Wait'], correctAnswer: 0 },
      { id: 'sf2-5', question: 'Why inspect the field before play?', options: ['To find money', 'To identify hazards (holes, glass, etc.)', 'To waste time', 'To measure bases'], correctAnswer: 1 }
    ]
  },

  // --- ROUND 3 ---
  'm21': {
    title: 'Module 21: Hitting 301',
    questions: [
      { id: 'h3-1', question: 'What is the "Kinetic Chain" in hitting?', options: ['The jewelry players wear', 'Energy transfer: Ground > Legs > Torso > Arms > Bat', 'A heavy bat', 'The dugout fence'], correctAnswer: 1 },
      { id: 'h3-2', question: 'What does "Launch Angle" measure?', options: ['How hard the ball is hit', 'The vertical angle the ball leaves the bat', 'The spin rate', 'The running speed'], correctAnswer: 1 },
      { id: 'h3-3', question: 'What is "Hip-Shoulder Separation"?', options: ['Dislocating a shoulder', 'Hips rotating open while shoulders stay closed to create torque', 'Standing apart', 'Leaning forward'], correctAnswer: 1 },
      { id: 'h3-4', question: 'What does a bat sensor typically measure?', options: ['Bat speed, attack angle, time to contact', 'Ball color', 'Grip strength', 'Player height'], correctAnswer: 0 },
      { id: 'h3-5', question: 'What is the "Attack Angle"?', options: ['Being aggressive', 'The angle of the bat path at impact relative to the ground', 'Yelling at the pitcher', 'Running angle'], correctAnswer: 1 }
    ]
  },
  'm22': {
    title: 'Module 22: Pitching 301',
    questions: [
      { id: 'p3-1', question: 'What is "Pitch Tunneling"?', options: ['Throwing under a bridge', 'Making different pitches look identical for the first 20+ feet', 'Throwing only strikes', 'Using a pitching machine'], correctAnswer: 1 },
      { id: 'p3-2', question: 'What is "Spin Efficiency"?', options: ['How fast the ball spins', 'The percentage of spin that contributes to movement (active spin)', 'How clean the ball is', 'Throwing curveballs'], correctAnswer: 1 },
      { id: 'p3-3', question: 'What does a Rapsodo unit measure?', options: ['Pitch velocity, spin rate, spin axis, and break', 'Runner speed', 'Batting average', 'Heart rate'], correctAnswer: 0 },
      { id: 'p3-4', question: 'What is the "Gyro Spin" component?', options: ['Bullet spin that does not create lift/break (inefficient spin)', 'A sandwich', 'Top spin', 'Back spin'], correctAnswer: 0 },
      { id: 'p3-5', question: 'Why is vertical approach angle (VAA) important?', options: ['It isn\'t', 'It affects how the batter perceives the pitch height crossing the plate', 'It makes the ball invisible', 'It increases velocity'], correctAnswer: 1 }
    ]
  },
  'm23': {
    title: 'Module 23: Catching 301',
    questions: [
      { id: 'c3-1', question: 'What is "Strike Probability"?', options: ['Guessing', 'The likelihood of a pitch being called a strike based on location/framing', 'Hitting a strike', 'Bowling'], correctAnswer: 1 },
      { id: 'c3-2', question: 'How does a catcher manage a pitcher\'s psyche?', options: ['Ignoring them', 'Recognizing stress cues and pacing the game', 'Yelling constantly', 'Calling timeouts every pitch'], correctAnswer: 1 },
      { id: 'c3-3', question: 'What is "Pop Time"?', options: ['Time to drink a soda', 'Time from ball hitting glove to ball hitting 2nd baseman\'s glove', 'Time to stand up', 'Time of the game'], correctAnswer: 1 },
      { id: 'c3-4', question: 'What is an elite pop time to 2nd base (MLB)?', options: ['2.5 seconds', 'Sub 2.0 seconds', '3.0 seconds', '1.0 second'], correctAnswer: 1 },
      { id: 'c3-5', question: 'How do you analyze a hitter\'s "cold zone"?', options: ['Use spray charts and heat maps', 'Guess', 'Ask the batter', 'Look at their shoes'], correctAnswer: 0 }
    ]
  },
  'm24': {
    title: 'Module 24: Baserunning 301',
    questions: [
      { id: 'b3-1', question: 'How do you calculate "Break Even" on steals?', options: ['Guessing', 'Success rate needed to increase Expected Runs (usually ~75%)', '50/50', 'Running every time'], correctAnswer: 1 },
      { id: 'b3-2', question: 'What is a "stopwatch read" on a pitcher?', options: ['Timing their delivery to home (e.g., 1.3s)', 'Checking game time', 'Timing their warmup', 'Timing the throw to first'], correctAnswer: 0 },
      { id: 'b3-3', question: 'What is the "vault" lead at second base?', options: ['Jumping', 'A walking lead to generate momentum', 'Standing still', 'Sitting down'], correctAnswer: 1 },
      { id: 'b3-4', question: 'How do you exploit a lefty pitcher\'s move?', options: ['Run on first flinch', 'Read the back leg (cross-over) vs lift leg', 'Stay on the bag', 'Guess'], correctAnswer: 1 },
      { id: 'b3-5', question: 'What is "secondary lead" depth importance?', options: ['It doesn\'t matter', 'Crucial for scoring on hits and breaking up double plays', 'Only for steals', 'To talk to the shortstop'], correctAnswer: 1 }
    ]
  },
  'm25': {
    title: 'Module 25: Infielding 301',
    questions: [
      { id: 'i3-1', question: 'What is "Defensive Runs Saved" (DRS)?', options: ['Runs scored', 'A metric valuing a player\'s defense vs average', 'Saves by a pitcher', 'Errors'], correctAnswer: 1 },
      { id: 'i3-2', question: 'What is the "pre-pitch hop"?', options: ['A dance', 'A timing mechanism to be weightless/agile at contact', 'Jumping for joy', 'Stretching'], correctAnswer: 1 },
      { id: 'i3-3', question: 'How do you read a "bad hop"?', options: ['Close eyes', 'Maintain glove presentation and adjust with soft elbows/torso', 'Run away', 'Kick it'], correctAnswer: 1 },
      { id: 'i3-4', question: 'When executing a relay, which side do you turn?', options: ['Glove side (usually)', 'Throwing side', 'Backwards', 'Don\'t turn'], correctAnswer: 0 },
      { id: 'i3-5', question: 'What is "range factor"?', options: ['How far you can throw', 'Putouts + Assists per 9 innings', 'Batting range', 'Running speed'], correctAnswer: 1 }
    ]
  },
  'm26': {
    title: 'Module 26: Outfielding 301',
    questions: [
      { id: 'o3-1', question: 'What is "Route Efficiency"?', options: ['How fast you run', 'Actual distance traveled vs straight line distance (optimal is 100%)', 'Gas mileage', 'Throwing accuracy'], correctAnswer: 1 },
      { id: 'o3-2', question: 'How do you handle "sun balls"?', options: ['Stare at the sun', 'Glove to shield eyes, check angle early, trust trajectory', 'Close eyes', 'Let it drop'], correctAnswer: 1 },
      { id: 'o3-3', question: 'What is the "fence check"?', options: ['Touching the fence before every pitch to know distance', 'Checking for holes', 'Climbing the fence', ' Painting the fence'], correctAnswer: 0 },
      { id: 'o3-4', question: 'When should you dive?', options: ['Every play', 'Only if it saves a run/extra bases and you can\'t get there standing', 'Never', 'For fun'], correctAnswer: 1 },
      { id: 'o3-5', question: 'What is the "banana route"?', options: ['Eating a snack', 'Curving approach to get behind the ball for a strong throw', 'Running in circles', 'Running straight'], correctAnswer: 1 }
    ]
  },
  'm27': {
    title: 'Module 27: Practice Planning III',
    questions: [
      { id: 'pp3-1', question: 'What is an IDP?', options: ['Identification Paper', 'Individualized Development Plan', 'Indoor Practice', 'Infield Drill'], correctAnswer: 1 },
      { id: 'pp3-2', question: 'What is "Load Management"?', options: ['Carrying equipment', 'Monitoring volume/intensity to prevent injury', 'Doing laundry', 'Loading bases'], correctAnswer: 1 },
      { id: 'pp3-3', question: 'How do you incorporate "random practice"?', options: ['Doing whatever', 'Mixing skills/drills unpredictably to improve retention', 'No plan', 'Random teams'], correctAnswer: 1 },
      { id: 'pp3-4', question: 'What is "constraint-led approach"?', options: ['Yelling', 'Manipulating the environment/task to force a skill adaptation', 'Using ropes', 'Strict rules'], correctAnswer: 1 },
      { id: 'pp3-5', question: 'Why video analysis in practice?', options: ['To make movies', 'To provide objective feedback vs feeling', 'To waste time', 'To look pro'], correctAnswer: 1 }
    ]
  },
  'm28': {
    title: 'Module 28: Philosophy III',
    questions: [
      { id: 'ph3-1', question: 'What defines a "transformational coach"?', options: ['Wins championships only', 'Focuses on holistic development and life skills', 'Yells the loudest', 'Trades players'], correctAnswer: 1 },
      { id: 'ph3-2', question: 'What is a "Leadership Council"?', options: ['The coaches', 'A group of players selected to bridge locker room and staff', 'Parents', 'Umpires'], correctAnswer: 1 },
      { id: 'ph3-3', question: 'How do you build "Psychological Safety"?', options: ['Punish mistakes', 'Create an environment where risks are encouraged without fear of shame', 'Ignore players', 'Strict rules'], correctAnswer: 1 },
      { id: 'ph3-4', question: 'What is "servant leadership"?', options: ['Bringing water', 'Prioritizing the needs of the team above self', 'Being a boss', 'Following orders'], correctAnswer: 1 },
      { id: 'ph3-5', question: 'How do you handle a toxic star player?', options: ['Ignore it because they are good', 'Address behavior standard immediately regardless of talent', 'Promote them', 'Quit'], correctAnswer: 1 }
    ]
  },
  'm29': {
    title: 'Module 29: Strategy III',
    questions: [
      { id: 'st3-1', question: 'What is "WAR" (Wins Above Replacement)?', options: ['A battle', 'A comprehensive stat measuring value vs a replacement player', 'Wins and Runs', 'Winning Average'], correctAnswer: 1 },
      { id: 'st3-2', question: 'What is "pythagorean expectation"?', options: ['Math homework', 'Estimating win% based on runs scored vs runs allowed', 'Triangle theory', 'Pitching angles'], correctAnswer: 1 },
      { id: 'st3-3', question: 'What is "leverage index"?', options: ['Using a crowbar', 'Measuring the criticality of a game situation', 'Batting average', 'Lifting weights'], correctAnswer: 1 },
      { id: 'st3-4', question: 'Why use an "opener"?', options: ['The starter is late', 'To get favorable matchups for the top of the order early', 'To lose', 'To save money'], correctAnswer: 1 },
      { id: 'st3-5', question: 'What is "run expectancy matrix"?', options: ['A movie', 'Average runs expected from a specific base/out state', 'Running drills', 'Expected lineup'], correctAnswer: 1 }
    ]
  },
  'm30': {
    title: 'Module 30: Safety III',
    questions: [
      { id: 'sf3-1', question: 'What is a "functional movement screen" (FMS)?', options: ['Watching TV', 'Assessing movement patterns to identify injury risk', 'Screening calls', 'Eye test'], correctAnswer: 1 },
      { id: 'sf3-2', question: 'What is "LTAD"?', options: ['Long Term Athletic Development', 'Left Turn at Denver', 'Low Tide', 'Large Team'], correctAnswer: 0 },
      { id: 'sf3-3', question: 'Why monitor "acute:chronic workload ratio"?', options: ['To do math', 'To prevent spikes in load that cause injury', 'To look smart', 'To count pitches'], correctAnswer: 1 },
      { id: 'sf3-4', question: 'What is "ucl reconstruction"?', options: ['Tommy John Surgery', 'Knee surgery', 'Brain surgery', 'Shoulder surgery'], correctAnswer: 0 },
      { id: 'sf3-5', question: 'The role of sleep in recovery?', options: ['Optional', 'Critical for hormonal balance and tissue repair', 'Waste of time', 'Only for weak players'], correctAnswer: 1 }
    ]
  }
};


export const SQUAD_MEMBERS: SquadMember[] = [
  { 
    id: 's1', 
    name: 'M. Rodriguez', 
    number: '45',
    role: 'Pitcher', 
    secondaryRole: 'RHP',
    status: 'Rest', 
    readiness: 65,
    avatar: 'MR',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1587280501635-68a6e82cd5ff?w=800&h=400&fit=crop',
    height: '6\'2"',
    weight: '195 lbs',
    bats: 'R',
    throws: 'R',
    age: 17,
    stats: [
        { label: 'FB Velo', value: '92 mph' },
        { label: 'SL Velo', value: '81 mph' },
        { label: 'Spin Rate', value: '2400' },
        { label: 'ERA', value: '2.14' }
    ],
    attributes: [
        { name: 'Velocity', value: 92 },
        { name: 'Control', value: 78 },
        { name: 'Stamina', value: 85 },
        { name: 'Mental', value: 88 }
    ],
    bio: 'High-ceiling arm. Needs consistent recovery work.',
    assignments: [
      { id: 'a1', drillId: 'd1', assignedDate: 1715420000000, status: 'Pending' },
      { id: 'a2', drillId: 'd2', assignedDate: 1715120000000, status: 'Completed' }
    ],
    videos: [
        {
            id: 'v1',
            title: 'Bullpen Session: Fastball Mechanics',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder video
            thumbnail: VIDEO_THUMB_1,
            date: '2 days ago',
            status: 'New',
            drillId: 'd1'
        },
        {
            id: 'v2',
            title: 'Slide Step Work',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Placeholder video
            thumbnail: VIDEO_THUMB_2,
            date: '1 week ago',
            status: 'Reviewed',
            drillId: 'd2'
        }
    ]
  },
  { 
    id: 's2', 
    name: 'J. Chen', 
    number: '12',
    role: 'Infield', 
    secondaryRole: 'SS/2B',
    status: 'Active', 
    readiness: 94, 
    avatar: 'JC',
    height: '5\'10"',
    weight: '175 lbs',
    bats: 'L',
    throws: 'R',
    age: 16,
    stats: [
        { label: '60yd', value: '6.6s' },
        { label: 'Exit Velo', value: '94 mph' },
        { label: 'Fielding %', value: '.985' },
        { label: 'OBP', value: '.412' }
    ],
    attributes: [
        { name: 'Contact', value: 90 },
        { name: 'Power', value: 65 },
        { name: 'Speed', value: 95 },
        { name: 'Defense', value: 92 }
    ],
    bio: 'Elite defender with gap-to-gap power.',
    assignments: [],
    videos: []
  },
  { 
    id: 's3', 
    name: 'D. Washington', 
    number: '27',
    role: 'Outfield', 
    secondaryRole: 'CF',
    status: 'Active', 
    readiness: 88, 
    avatar: 'DW',
    height: '6\'3"',
    weight: '205 lbs',
    bats: 'R',
    throws: 'R',
    age: 18,
    stats: [
        { label: 'Exit Velo', value: '102 mph' },
        { label: 'HR', value: '12' },
        { label: 'RBI', value: '45' },
        { label: 'Arm Str', value: '95 mph' }
    ],
    attributes: [
        { name: 'Contact', value: 75 },
        { name: 'Power', value: 98 },
        { name: 'Speed', value: 82 },
        { name: 'Arm', value: 95 }
    ],
    bio: 'Five-tool potential. Team captain.',
    assignments: [],
    videos: []
  },
  { 
    id: 's4', 
    name: 'A. Petrov', 
    number: '05',
    role: 'Catcher', 
    secondaryRole: '1B',
    status: 'Injured', 
    readiness: 42, 
    avatar: 'AP',
    height: '6\'0"',
    weight: '210 lbs',
    bats: 'R',
    throws: 'R',
    age: 17,
    stats: [
        { label: 'Pop Time', value: '1.95s' },
        { label: 'Blocks', value: '98%' },
        { label: 'CS %', value: '40%' },
        { label: 'CERA', value: '2.50' }
    ],
    attributes: [
        { name: 'Receiving', value: 94 },
        { name: 'Blocking', value: 88 },
        { name: 'Throwing', value: 85 },
        { name: 'Leadership', value: 99 }
    ],
    bio: 'Field general. Currently rehabbing ankle.',
    assignments: [],
    videos: []
  },
  { 
    id: 's5', 
    name: 'K. O\'Connor', 
    number: '09',
    role: 'Utility', 
    secondaryRole: '3B/OF',
    status: 'Active', 
    readiness: 91, 
    avatar: 'KO',
    height: '5\'11"',
    weight: '185 lbs',
    bats: 'L',
    throws: 'R',
    age: 17,
    stats: [
        { label: 'AVG', value: '.305' },
        { label: 'OPS', value: '.850' },
        { label: 'QAB', value: '65%' },
        { label: 'Utility', value: 'All' }
    ],
    attributes: [
        { name: 'Versatility', value: 95 },
        { name: 'Contact', value: 85 },
        { name: 'Power', value: 75 },
        { name: 'IQ', value: 90 }
    ],
    bio: 'Swiss army knife. Play him anywhere.',
    assignments: [],
    videos: []
  },
  { 
    id: 's6', 
    name: 'T. Silva', 
    number: '33',
    role: 'Pitcher', 
    secondaryRole: 'LHP',
    status: 'Active', 
    readiness: 85,
    avatar: 'TS',
    height: '6\'1"',
    weight: '180 lbs',
    bats: 'L',
    throws: 'L',
    age: 16,
    stats: [
        { label: 'FB Velo', value: '86 mph' },
        { label: 'CV Velo', value: '72 mph' },
        { label: 'K/BB', value: '4.5' },
        { label: 'WHIP', value: '1.05' }
    ],
    attributes: [
        { name: 'Velocity', value: 80 },
        { name: 'Control', value: 95 },
        { name: 'Movement', value: 92 },
        { name: 'Mental', value: 85 }
    ],
    bio: 'Surgical precision. Pitchability is elite.',
    assignments: [],
    videos: []
  },
];

export const FOUNDATIONS_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which component of the kinetic chain initiates power generation in most rotational athletic movements?',
    options: [
      'The Hands',
      'The Core',
      'Ground Reaction Forces',
      'The Shoulders'
    ],
    correctAnswer: 2
  },
  {
    id: 'q2',
    question: 'In an efficient hip hinge, the spine should remain in what position?',
    options: [
      'Flexed (Rounded)',
      'Neutral',
      'Extended (Arched)',
      'Rotated'
    ],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: 'What is the primary purpose of "scapular loading" in a throwing motion?',
    options: [
      'To create elastic energy (stretch-shortening)',
      'To look intimidating',
      'To decrease range of motion',
      'To lock the elbow'
    ],
    correctAnswer: 0
  },
  {
    id: 'q4',
    question: 'Which term describes the loss of energy transfer efficiently through the body segments?',
    options: [
      'Power Surge',
      'Kinetic Link',
      'Energy Leak',
      'Force Coupling'
    ],
    correctAnswer: 2
  },
  {
    id: 'q5',
    question: 'Proximal stability promotes distal ________.',
    options: [
      'Mobility',
      'Stiffness',
      'Weakness',
      'Fatigue'
    ],
    correctAnswer: 0
  }
];

export const PROGRAM_DESIGN_QUIZ: QuizQuestion[] = [
  {
    id: 'pd1',
    question: 'What is the primary focus of an Anatomical Adaptation phase?',
    options: [
      'Max Strength',
      'Prepare tendons and ligaments for heavier loads',
      'Peak Power output',
      'Speed endurance'
    ],
    correctAnswer: 1
  },
  {
    id: 'pd2',
    question: 'In a high-low nervous system split, which activity is considered "High" CNS stress?',
    options: [
      'Tempo runs',
      'Mobility work',
      'Max Velocity Sprinting',
      'Zone 2 cycling'
    ],
    correctAnswer: 2
  },
  {
    id: 'pd3',
    question: 'Which rest interval is required for full ATP-PC replenishment?',
    options: [
      '30 seconds',
      '1 minute',
      '3-5 minutes',
      '10 minutes'
    ],
    correctAnswer: 2
  },
  {
    id: 'pd4',
    question: 'Contrast training (French Contrast) is used to develop:',
    options: [
      'Aerobic capacity',
      'Hypertrophy',
      'Rate of Force Development (RFD)',
      'Flexibility'
    ],
    correctAnswer: 2
  },
  {
    id: 'pd5',
    question: 'When tapering for playoffs, volume should drop by approximately:',
    options: [
      '10%',
      '40-60%',
      '90%',
      '0% (Keep pushing)'
    ],
    correctAnswer: 1
  }
];

export const INITIAL_CUSTOM_QUIZZES: CustomQuiz[] = [
  {
    id: 'cq1',
    title: 'Pre-Season Pitching Intake',
    description: 'Standard baseline knowledge assessment for all incoming pitchers. Covers biomechanics and pitch design terminology.',
    status: 'Active',
    scheduledDate: '2024-03-15',
    linkedToCert: false,
    assignedCount: 4,
    questions: [
        {
            id: 'pq1',
            question: 'What is the ideal spin axis for a 4-seam fastball to maximize carry?',
            options: ['12:00', '1:30', '3:00', '10:30'],
            correctAnswer: 0
        },
        {
            id: 'pq2',
            question: 'Define "tunnelling" in the context of pitch sequencing.',
            options: [
                'Throwing through a physical tunnel',
                'Making two different pitches look the same for as long as possible',
                'Throwing only fastballs',
                'The path the catcher takes to the mound'
            ],
            correctAnswer: 1
        }
    ]
  },
  {
    id: 'cq2',
    title: 'Advanced Base-running Logic',
    description: 'Situational awareness test for varsity squad. Focus on 1st and 3rd situations.',
    status: 'Draft',
    linkedToCert: true,
    assignedCount: 0,
    questions: []
  }
];

export const LEAGUE_STANDINGS: LeagueParticipant[] = [
  { rank: 1, name: "Coach Carter", xp: 2450, avatar: "CC", isCurrentUser: false, trend: 'up' },
  { rank: 2, name: "T. Lasorda", xp: 2310, avatar: "TL", isCurrentUser: false, trend: 'up' },
  { rank: 3, name: "B. Bochy", xp: 2280, avatar: "BB", isCurrentUser: false, trend: 'same' },
  { rank: 4, name: "C. Stengel", xp: 2100, avatar: "CS", isCurrentUser: false, trend: 'down' },
  { rank: 5, name: "J. Torre", xp: 2050, avatar: "JT", isCurrentUser: false, trend: 'same' },
  { rank: 6, name: "S. Anderson", xp: 1980, avatar: "SA", isCurrentUser: false, trend: 'same' },
  { rank: 7, name: "Coach Prime", xp: 1920, avatar: "ME", isCurrentUser: true, trend: 'up' },
  { rank: 8, name: "T. Francona", xp: 1850, avatar: "TF", isCurrentUser: false, trend: 'down' },
  { rank: 9, name: "D. Roberts", xp: 1700, avatar: "DR", isCurrentUser: false, trend: 'same' },
  { rank: 10, name: "A. Boone", xp: 1650, avatar: "AB", isCurrentUser: false, trend: 'down' },
  { rank: 11, name: "B. Snitker", xp: 1620, avatar: "BS", isCurrentUser: false, trend: 'same' },
  { rank: 12, name: "K. Cash", xp: 1590, avatar: "KC", isCurrentUser: false, trend: 'up' },
  { rank: 13, name: "C. Counsell", xp: 1400, avatar: "CC", isCurrentUser: false, trend: 'down' },
  { rank: 14, name: "D. Baker", xp: 1250, avatar: "DB", isCurrentUser: false, trend: 'down' },
  { rank: 15, name: "B. Melvin", xp: 980, avatar: "BM", isCurrentUser: false, trend: 'same' },
];

export const MOCK_SOCIAL_FEED: SocialPost[] = [
  {
    id: 'p1',
    authorId: 'u1',
    authorName: 'Coach Prime',
    authorAvatar: 'ME',
    authorRole: 'Coach',
    content: 'Just added the new "Three Pump Drill" to the Drill DataBase. Great for pitchers struggling with rushing their delivery. Let\'s see some consistent reps this week! 🎯',
    timestamp: '2h ago',
    drillId: 'd1',
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: true,
    xpEarned: 150
  },
  {
    id: 'p2',
    authorId: 's3',
    authorName: 'D. Washington',
    authorAvatar: 'DW',
    authorRole: 'Athlete',
    content: 'Hit a PR on exit velo today! 102mph off the tee. The core work is paying off. 🚀💪',
    timestamp: '4h ago',
    likes: 56,
    comments: 12,
    shares: 8,
    isLiked: false
  },
  {
    id: 'p3',
    authorId: 's1',
    authorName: 'M. Rodriguez',
    authorAvatar: 'MR',
    authorRole: 'Athlete',
    content: 'Looking for a partner to run the Short Hop Series after practice tomorrow. Anyone down?',
    timestamp: '5h ago',
    drillId: 'd6',
    likes: 8,
    comments: 3,
    shares: 0,
    isLiked: false
  }
];

export const INITIAL_SAVED_COLLECTIONS: SavedCollection[] = [
  {
    id: 'col1',
    title: 'Hitting Mechanics',
    color: '#DC2626', // duo-green (which is actually red in this theme, confusing name but sticking to palette)
    postIds: ['p2']
  },
  {
    id: 'col2',
    title: 'Drill Ideas',
    color: '#4B5563', // duo-blue
    postIds: ['p1', 'p3']
  },
  {
    id: 'col3',
    title: 'Intel',
    color: '#10B981',
    postIds: []
  }
];
