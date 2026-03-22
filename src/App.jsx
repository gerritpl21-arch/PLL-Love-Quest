import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import "./index.css";

const THEMES = [
  { key: "love", label: "Love Quest" },
  { key: "cozy", label: "Cozy Quest" },
  { key: "afterdark", label: "After Dark" },
  { key: "baby", label: "Baby Mode" },
];

const DICE = [4, 6, 8, 10, 12, 20];

const NARRATOR_OPENERS = [
  "Processing romantic probability...",
  "The dungeon AI squints at your life choices.",
  "Fate groans, then leans forward.",
  "The dice gods have filed their report.",
  "A deeply unnecessary amount of dramatic tension has been detected.",
];

const NARRATOR_SUCCESS = [
  "Reward unlocked. Try not to look too pleased with yourself.",
  "Congratulations. The universe has chosen indulgence.",
  "Luck has spoken. You may now act smug.",
  "A prize has emerged from the chaos.",
];

const NARRATOR_FAIL = [
  "Critical failure. The dice are embarrassed for you.",
  "A catastrophic emotional misfire has occurred.",
  "The romance engine has briefly stalled.",
  "Fate has selected suffering. Cute suffering, but still.",
];

const NARRATOR_CHAOS = [
  "Chaos event detected. Naturally.",
  "Reality hiccups. This is now your problem.",
  "A rare anomaly appears. Try to act surprised.",
  "The dungeon AI has authorized extra nonsense.",
];

const CHAOS_EVENTS = [
  {
    id: "chaos-double",
    title: "Double Reward",
    description: "Roll again after claiming this. Both rewards apply.",
  },
  {
    id: "chaos-dessert",
    title: "Dessert Tax",
    description: "Add dessert to whatever just unlocked.",
  },
  {
    id: "chaos-upgrade",
    title: "Upgrade Trigger",
    description: "Upgrade this reward to the deluxe version.",
  },
  {
    id: "chaos-tomorrow",
    title: "Tomorrow Echo",
    description: "This reward can also be claimed again tomorrow.",
  },
  {
    id: "chaos-blessing",
    title: "Dice Blessing",
    description: "Ignore the next critical fail.",
  },
];

const PENALTIES = [
  {
    id: "penalty-compliments",
    title: "Compliment Barrage",
    description: "You must give Gerrit five sincere compliments immediately.",
  },
  {
    id: "penalty-coffee",
    title: "Coffee Tribute",
    description: "You must make Gerrit a coffee or tea.",
  },
  {
    id: "penalty-shoulders",
    title: "Shoulder Service",
    description: "You owe Gerrit a 2-minute shoulder rub.",
  },
  {
    id: "penalty-kiss",
    title: "Kiss Tax",
    description: "You must deliver ten kisses. Efficiently.",
  },
  {
    id: "penalty-date",
    title: "Planning Duty",
    description: "You must choose the next date idea.",
  },
  {
    id: "penalty-cuddle",
    title: "Cuddle Initiation",
    description: "You must initiate the next cuddle session.",
  },
];

const LEGENDARY_REWARDS = [
  {
    id: "legend-anything",
    title: "Legendary Choice",
    description: "Choose any reward you want. Yes, any.",
  },
  {
    id: "legend-weekend",
    title: "Weekend Adventure",
    description: "A weekend outing or mini adventure gets scheduled.",
  },
  {
    id: "legend-date",
    title: "Deluxe Date Night",
    description: "Gerrit plans the full date. Details are not your burden.",
  },
  {
    id: "legend-babyfree",
    title: "Legendary Baby-Free Block",
    description: "PLL receives a substantial chunk of uninterrupted freedom.",
  },
  {
    id: "legend-two",
    title: "Double Claim",
    description: "Claim this reward, then immediately roll again.",
  },
];

const REWARD_POOLS = {
  love: {
    4: [
      { id: "love-4-1", title: "Forehead Kiss", description: "A soft forehead kiss is now mandatory." },
      { id: "love-4-2", title: "Coffee Delivery", description: "PLL gets a drink delivered to her exact location." },
      { id: "love-4-3", title: "One-Minute Hug", description: "A long hug. No rushing. No escaping." },
      { id: "love-4-4", title: "Flirty Text", description: "Send PLL one genuinely good flirty message." },
      { id: "love-4-5", title: "Hand Hold Voucher", description: "Hold hands for a full minute like civilized romantics." },
      { id: "love-4-6", title: "Snack Fetch", description: "Fetch PLL a snack of her choosing." },
    ],
    6: [
      { id: "love-6-1", title: "Foot Rub", description: "PLL receives a 5-minute foot rub." },
      { id: "love-6-2", title: "Tea Together", description: "Pause life and share tea or coffee together." },
      { id: "love-6-3", title: "Movie Choice", description: "PLL chooses the movie tonight." },
      { id: "love-6-4", title: "Praise of the Bard", description: "PLL receives five genuine compliments." },
      { id: "love-6-5", title: "Dessert Run", description: "Go obtain something sweet together." },
      { id: "love-6-6", title: "Couch Cuddle", description: "Mandatory cuddle session has been authorized." },
      { id: "love-6-7", title: "Gerrit Benefit: Song Choice", description: "Gerrit picks the music for the next 20 minutes." },
      { id: "love-6-8", title: "PLL Benefit: Bath Setup", description: "A bath is prepared for PLL." },
    ],
    8: [
      { id: "love-8-1", title: "Slow Dance", description: "Slow dance in the kitchen. Dignity optional." },
      { id: "love-8-2", title: "Phone-Free Time", description: "Twenty minutes together, no phones allowed." },
      { id: "love-8-3", title: "Evening Walk", description: "Take a walk together and be annoyingly cute." },
      { id: "love-8-4", title: "Candle Moment", description: "Create a candlelit moment tonight." },
      { id: "love-8-5", title: "Cook Together", description: "Make something together, even if it’s chaotic." },
      { id: "love-8-6", title: "PLL Benefit: Nap Protection", description: "PLL gets a protected nap window." },
      { id: "love-8-7", title: "Gerrit Benefit: Lap Lounge", description: "PLL must sit with Gerrit for five uninterrupted minutes." },
      { id: "love-8-8", title: "Memory Talk", description: "Share one favorite memory together." },
      { id: "love-8-9", title: "Takeout Date", description: "Upgrade dinner into a tiny date." },
      { id: "love-8-10", title: "Sweet Surprise", description: "PLL gets a surprise treat." },
    ],
    10: [
      { id: "love-10-1", title: "Breakfast in Bed", description: "PLL receives breakfast in bed." },
      { id: "love-10-2", title: "Planned Movie Night", description: "Gerrit handles the setup. PLL gets the vibe." },
      { id: "love-10-3", title: "Coffee Date", description: "Go out for a real coffee date." },
      { id: "love-10-4", title: "Sunset Walk", description: "Take a proper romantic walk together." },
      { id: "love-10-5", title: "Massage Session", description: "PLL receives a longer massage." },
      { id: "love-10-6", title: "Board Game Duel", description: "Play a game together. Trash talk allowed." },
      { id: "love-10-7", title: "Gerrit Benefit: Choose the Show", description: "Gerrit chooses tonight’s show without complaint." },
      { id: "love-10-8", title: "PLL Benefit: No Chores Night", description: "PLL is exempt from chores tonight." },
      { id: "love-10-9", title: "Dessert Outing", description: "Leave the house for dessert together." },
      { id: "love-10-10", title: "Mini Picnic", description: "Create a tiny picnic or picnic-like moment." },
      { id: "love-10-11", title: "Love Note", description: "PLL receives a handwritten note." },
      { id: "love-10-12", title: "Stay Close Rule", description: "Remain within arm’s reach for ten minutes." },
    ],
    12: [
      { id: "love-12-1", title: "Full Spa Evening", description: "PLL gets a proper at-home spa setup." },
      { id: "love-12-2", title: "Sleep-In Pass", description: "PLL sleeps in. Gerrit handles the morning." },
      { id: "love-12-3", title: "No Chores Day", description: "PLL is released from domestic obligations." },
      { id: "love-12-4", title: "Planned Romantic Date", description: "Gerrit plans it. PLL just appears." },
      { id: "love-12-5", title: "Surprise Gift", description: "A small gift or surprise must be produced." },
      { id: "love-12-6", title: "Brunch Outing", description: "Go out for brunch together." },
      { id: "love-12-7", title: "Adventure Outing", description: "Plan a meaningful outing together." },
      { id: "love-12-8", title: "Long Massage", description: "PLL gets the deluxe massage edition." },
      { id: "love-12-9", title: "Candlelit Dinner", description: "Tonight’s dinner gets upgraded." },
      { id: "love-12-10", title: "Gerrit Benefit: Choose the Plan", description: "Gerrit chooses tomorrow’s couple plan." },
      { id: "love-12-11", title: "PLL Benefit: Recharge Block", description: "PLL gets a real uninterrupted recharge block." },
      { id: "love-12-12", title: "Couple Reward: Stargazing", description: "Go outside and have a proper stargazing moment." },
    ],
    20: [
      { id: "love-20-1", title: "Choose Any Reward", description: "PLL chooses any unlocked style of reward." },
      { id: "love-20-2", title: "Double Reward", description: "Claim this, then roll again." },
      { id: "love-20-3", title: "Surprise Date Night", description: "A bigger date gets planned." },
      { id: "love-20-4", title: "Weekend Planning Pass", description: "Plan a proper adventure together." },
      { id: "love-20-5", title: "Deluxe Spa Night", description: "Upgrade relaxation to absurd levels." },
      { id: "love-20-6", title: "PLL Benefit: Full Day Off", description: "PLL receives a genuine day off from as much as possible." },
      { id: "love-20-7", title: "Couple Reward: Memory Night", description: "Make the evening about photos, memories, and connection." },
      { id: "love-20-8", title: "Gerrit Benefit: Hero’s Welcome", description: "PLL must dramatically praise Gerrit for one full minute." },
    ],
  },

  cozy: {
    4: [
      { id: "cozy-4-1", title: "Blanket Wrap", description: "PLL is wrapped into maximum comfort." },
      { id: "cozy-4-2", title: "Hot Drink", description: "Prepare a warm drink for PLL." },
      { id: "cozy-4-3", title: "Quiet Minute", description: "One peaceful minute together. No phones." },
      { id: "cozy-4-4", title: "Warm Socks", description: "Comfy mode has been activated." },
      { id: "cozy-4-5", title: "Soft Kiss", description: "Deliver one annoyingly wholesome kiss." },
      { id: "cozy-4-6", title: "Tiny Treat", description: "Fetch a small comfort snack." },
    ],
    6: [
      { id: "cozy-6-1", title: "Back Rub", description: "PLL gets a relaxing back rub." },
      { id: "cozy-6-2", title: "Reading Time", description: "Read quietly together for a bit." },
      { id: "cozy-6-3", title: "Comfort Show", description: "Put on a comfort show or movie." },
      { id: "cozy-6-4", title: "Couch Nest", description: "Build a blanket-and-pillow nest." },
      { id: "cozy-6-5", title: "Soup or Snack", description: "Prepare comfort food or a cozy snack." },
      { id: "cozy-6-6", title: "PLL Benefit: Protected Nap", description: "PLL gets a short protected nap." },
      { id: "cozy-6-7", title: "Gerrit Benefit: Cuddle Summon", description: "PLL must report for cuddle duty." },
      { id: "cozy-6-8", title: "Soft Music", description: "Set the room to calm mode." },
    ],
    8: [
      { id: "cozy-8-1", title: "Bath Ritual", description: "Prepare a proper relaxing bath." },
      { id: "cozy-8-2", title: "Movie Cocoon", description: "Blankets, snacks, movie. Minimal movement." },
      { id: "cozy-8-3", title: "Bake Something", description: "Make something warm and comforting together." },
      { id: "cozy-8-4", title: "Tea & Talk", description: "Talk quietly over something warm." },
      { id: "cozy-8-5", title: "Early Lights Down", description: "Dim the room and embrace low energy." },
      { id: "cozy-8-6", title: "PLL Benefit: No Chores Tonight", description: "PLL is off duty tonight." },
      { id: "cozy-8-7", title: "Couple Reward: Puzzle or Game", description: "Do something calm together." },
      { id: "cozy-8-8", title: "Long Cuddle", description: "A real, uninterrupted cuddle block." },
      { id: "cozy-8-9", title: "Quiet Walk", description: "Take a short peaceful walk." },
      { id: "cozy-8-10", title: "Gerrit Benefit: Lap Pillow", description: "PLL becomes a temporary lap pillow provider." },
    ],
    10: [
      { id: "cozy-10-1", title: "Comfort Dinner", description: "Tonight becomes about comfort food." },
      { id: "cozy-10-2", title: "Long Bath", description: "PLL gets an upgraded bath session." },
      { id: "cozy-10-3", title: "Recharge Evening", description: "Everything slows down tonight." },
      { id: "cozy-10-4", title: "Blanket Fort", description: "Yes, adults can do this too." },
      { id: "cozy-10-5", title: "Massage and Music", description: "Calm music plus a real massage." },
      { id: "cozy-10-6", title: "Sleep Early Pass", description: "An early night is officially approved." },
      { id: "cozy-10-7", title: "PLL Benefit: Full Rest Window", description: "PLL gets a proper recharge block." },
      { id: "cozy-10-8", title: "Couple Reward: Candle Night", description: "Dim lights. Cozy energy only." },
      { id: "cozy-10-9", title: "Gerrit Benefit: Choose the Cozy Film", description: "Gerrit chooses the comfort movie." },
      { id: "cozy-10-10", title: "Rainy-Day Mode", description: "Act like the world can wait." },
    ],
    12: [
      { id: "cozy-12-1", title: "Deluxe Cozy Night", description: "Blankets, snacks, candles, no obligations." },
      { id: "cozy-12-2", title: "Sleep-In Shield", description: "PLL sleeps in. The morning belongs to Gerrit." },
      { id: "cozy-12-3", title: "No Chores Day", description: "PLL is excused from effort." },
      { id: "cozy-12-4", title: "Comfort Outing", description: "Go out for one deeply pleasant thing." },
      { id: "cozy-12-5", title: "PLL Benefit: Full Recharge", description: "A real recharge block is granted." },
      { id: "cozy-12-6", title: "Couple Reward: Stay-In Date", description: "A home date with maximum coziness." },
      { id: "cozy-12-7", title: "Long Massage", description: "PLL gets the premium massage edition." },
      { id: "cozy-12-8", title: "Candle Bath Deluxe", description: "Upgrade bath preparation to a ridiculous level." },
      { id: "cozy-12-9", title: "Warm Dessert", description: "Acquire or make a top-tier cozy dessert." },
      { id: "cozy-12-10", title: "Gerrit Benefit: Rest on Demand", description: "PLL must tolerate Gerrit being extra clingy." },
      { id: "cozy-12-11", title: "Bookstore or Coffee Trip", description: "Go somewhere soft and pleasant together." },
      { id: "cozy-12-12", title: "Day Reset", description: "The day gets rewritten as a comfort day." },
    ],
    20: [
      { id: "cozy-20-1", title: "Choose Any Cozy Reward", description: "Pick your ideal cozy outcome." },
      { id: "cozy-20-2", title: "Cozy Marathon", description: "Claim this, then stack a second cozy reward." },
      { id: "cozy-20-3", title: "Recharge Day", description: "The schedule bends around comfort." },
      { id: "cozy-20-4", title: "Premium Stay-In Date", description: "A fully upgraded cozy date is required." },
      { id: "cozy-20-5", title: "PLL Benefit: Full Comfort Amnesty", description: "PLL is off duty as much as possible." },
      { id: "cozy-20-6", title: "Couple Reward: Escape the Noise", description: "Go somewhere calm together." },
      { id: "cozy-20-7", title: "Gerrit Benefit: Demands Extra Cuddles", description: "The dungeon AI has sided with Gerrit." },
    ],
  },

  afterdark: {
    4: [
      { id: "dark-4-1", title: "Slow Kiss", description: "A slow kiss. No rushing. The AI is watching." },
      { id: "dark-4-2", title: "Whisper Mission", description: "Whisper something scandalous in Gerrit’s ear." },
      { id: "dark-4-3", title: "Lap Trap", description: "Sit on Gerrit’s lap for five uninterrupted minutes." },
      { id: "dark-4-4", title: "Close Quarters", description: "Remain within arm’s reach for ten minutes." },
      { id: "dark-4-5", title: "Gerrit Benefit: Pick the Music", description: "Gerrit controls the mood music." },
      { id: "dark-4-6", title: "Look at Me", description: "Hold eye contact for longer than feels normal." },
    ],
    6: [
      { id: "dark-6-1", title: "Makeout Pass", description: "Immediate makeout session authorized." },
      { id: "dark-6-2", title: "Choose the Outfit", description: "Gerrit chooses what you wear tonight." },
      { id: "dark-6-3", title: "Lights Low Protocol", description: "Dim the lights. Phones are banished." },
      { id: "dark-6-4", title: "Bedroom DJ", description: "One of you controls the music. The other obeys the vibe." },
      { id: "dark-6-5", title: "Hands-On Massage", description: "PLL receives a slow, focused massage." },
      { id: "dark-6-6", title: "Gerrit Benefit: Lap Lounge Deluxe", description: "PLL reports to Gerrit’s lap again. Yes, again." },
      { id: "dark-6-7", title: "Neck Kiss Tax", description: "A few neck kisses. Try not to act surprised." },
      { id: "dark-6-8", title: "Couch Heat Mode", description: "You are now required to get distractingly close." },
    ],
    8: [
      { id: "dark-8-1", title: "Slow Dance in the Dark", description: "Music optional. Chemistry required." },
      { id: "dark-8-2", title: "Candlelight Contact", description: "Candles lit. Stay close. See what happens." },
      { id: "dark-8-3", title: "Kiss Challenge", description: "A longer kiss challenge has been issued." },
      { id: "dark-8-4", title: "Choose the Next Move", description: "PLL chooses the next intimate move." },
      { id: "dark-8-5", title: "After Hours Cuddle Lock", description: "No one leaves the cuddle zone voluntarily." },
      { id: "dark-8-6", title: "Gerrit Benefit: Tease Rights", description: "PLL must flirt first." },
      { id: "dark-8-7", title: "Hands and Attention", description: "Focused attention only. No distractions." },
      { id: "dark-8-8", title: "Shared Shower Voucher", description: "Turn an ordinary shower into a shared one." },
      { id: "dark-8-9", title: "Whisper Upgrade", description: "Say something that would make daytime-you blush." },
      { id: "dark-8-10", title: "Sit Closer", description: "Not that close. Closer." },
    ],
    10: [
      { id: "dark-10-1", title: "Rule-Free Hour", description: "One hour of spontaneous affection. Enjoy the chaos." },
      { id: "dark-10-2", title: "Bedroom Authority", description: "PLL chooses the next romantic activity." },
      { id: "dark-10-3", title: "No Bedtime Rules", description: "Staying up late has been officially approved." },
      { id: "dark-10-4", title: "Shower Upgrade", description: "A shared shower becomes tonight’s side quest." },
      { id: "dark-10-5", title: "Massage Escalation", description: "Upgrade to a longer, slower massage session." },
      { id: "dark-10-6", title: "Pick the Mood", description: "PLL sets the tone for the night." },
      { id: "dark-10-7", title: "Gerrit Benefit: Makeout Priority", description: "Gerrit may cash in on a proper makeout session." },
      { id: "dark-10-8", title: "After Dark Date", description: "The evening becomes a very adult mini-date." },
      { id: "dark-10-9", title: "Say What You Want", description: "PLL must say exactly what she wants next." },
      { id: "dark-10-10", title: "Couch Makeout Mode", description: "The couch is no longer for innocent behavior." },
    ],
    12: [
      { id: "dark-12-1", title: "Control the Night", description: "PLL gets full authority over the next romantic sequence." },
      { id: "dark-12-2", title: "Luxury Massage", description: "A full massage session with no shortcuts." },
      { id: "dark-12-3", title: "Dress Code Override", description: "Tonight’s outfit choices are now strategic." },
      { id: "dark-12-4", title: "Late Night Mission", description: "The night now requires effort, intent, and chemistry." },
      { id: "dark-12-5", title: "Deluxe Makeout Pass", description: "Longer, slower, less civilized." },
      { id: "dark-12-6", title: "Gerrit Benefit: Pick the Scenario", description: "Gerrit chooses the setting for the next moment." },
      { id: "dark-12-7", title: "Candlelit Trouble", description: "Candles and poor decision-making energy." },
      { id: "dark-12-8", title: "Stay in My Orbit", description: "PLL must remain close for the next 20 minutes." },
      { id: "dark-12-9", title: "Shower Together Deluxe", description: "Yes, this one got upgraded." },
      { id: "dark-12-10", title: "R-rated Movie Energy", description: "The evening is now firmly not PG." },
      { id: "dark-12-11", title: "Say It Out Loud", description: "PLL must say one thing she wants more of." },
      { id: "dark-12-12", title: "Choose Any Bold Reward", description: "PLL chooses from the bolder side of the pool." },
    ],
    20: [
      { id: "dark-20-1", title: "Legendary Night", description: "PLL chooses exactly how the night goes." },
      { id: "dark-20-2", title: "Double After Dark", description: "Claim this, then roll again." },
      { id: "dark-20-3", title: "Premium Shared Shower", description: "Yes. That one. Upgraded." },
      { id: "dark-20-4", title: "Zero Distractions Protocol", description: "Everything else can wait. Everything." },
      { id: "dark-20-5", title: "Gerrit Benefit: His Turn to Choose", description: "The dungeon AI has smiled upon Gerrit." },
      { id: "dark-20-6", title: "Couple Reward: Full After Dark Date", description: "A bold evening gets properly staged." },
      { id: "dark-20-7", title: "Choose Any After Dark Reward", description: "PLL picks the exact reward she wants." },
      { id: "dark-20-8", title: "Keep the Lights Low", description: "The night is no longer pretending to be innocent." },
    ],
  },

  baby: {
    4: [
      { id: "baby-4-1", title: "Next Diaper Transfer", description: "Gerrit handles the next diaper." },
      { id: "baby-4-2", title: "Quick Coffee Break", description: "PLL gets a quiet coffee or tea break." },
      { id: "baby-4-3", title: "Cry Response Pass", description: "Gerrit responds to the next baby cry." },
      { id: "baby-4-4", title: "Bottle or Snack Setup", description: "Gerrit handles the setup task." },
      { id: "baby-4-5", title: "Five-Minute Reset", description: "PLL gets five guilt-free minutes to herself." },
      { id: "baby-4-6", title: "Gerrit Benefit: Baby Cuddle", description: "Gerrit gets the next baby cuddle window." },
    ],
    6: [
      { id: "baby-6-1", title: "Diaper Duty Pass", description: "The next diaper belongs to Gerrit." },
      { id: "baby-6-2", title: "Nap Guardian", description: "Gerrit protects PLL’s next nap." },
      { id: "baby-6-3", title: "Baby Walk Pass", description: "Gerrit takes the baby for a walk." },
      { id: "baby-6-4", title: "Laundry Liberation", description: "PLL is excused from baby laundry." },
      { id: "baby-6-5", title: "Shower Protection", description: "PLL gets an uninterrupted shower." },
      { id: "baby-6-6", title: "Bottle Prep", description: "Gerrit handles the prep work." },
      { id: "baby-6-7", title: "Gerrit Benefit: Hero Recognition", description: "PLL must admit Gerrit is doing a good job." },
      { id: "baby-6-8", title: "Snack Rescue", description: "PLL gets food brought to her." },
    ],
    8: [
      { id: "baby-8-1", title: "Baby-Free Hour", description: "PLL gets one hour baby-free." },
      { id: "baby-8-2", title: "Full Bedtime Assist", description: "Gerrit takes lead on the bedtime scramble." },
      { id: "baby-8-3", title: "Nap Extension", description: "PLL gets a longer protected rest period." },
      { id: "baby-8-4", title: "Cry Response Shift", description: "The next cry is fully Gerrit’s problem." },
      { id: "baby-8-5", title: "Errand Escape", description: "PLL does not handle the next errand." },
      { id: "baby-8-6", title: "Meal Rescue", description: "Gerrit handles a meal solution." },
      { id: "baby-8-7", title: "Couple Reward: Baby Asleep Window", description: "Use the next quiet window for yourselves." },
      { id: "baby-8-8", title: "Gerrit Benefit: Baby Duty Bonding", description: "Gerrit gets quality time on assignment." },
      { id: "baby-8-9", title: "Mom Recharge", description: "PLL disappears for a bit. No questions asked." },
      { id: "baby-8-10", title: "Stroller Escape", description: "Gerrit takes the baby out so PLL gets peace." },
    ],
    10: [
      { id: "baby-10-1", title: "Half Day Relief", description: "PLL gets meaningful baby-duty relief." },
      { id: "baby-10-2", title: "Morning Duty Transfer", description: "Gerrit handles the next morning stretch." },
      { id: "baby-10-3", title: "No Chores + Baby Combo", description: "PLL is off baby support and chores for a block." },
      { id: "baby-10-4", title: "Recharge Outing", description: "PLL gets time out of the house alone." },
      { id: "baby-10-5", title: "Full Bath + Rest Window", description: "PLL gets peace and recovery time." },
      { id: "baby-10-6", title: "Gerrit Benefit: Command Shift", description: "Gerrit takes over and gets to run the plan." },
      { id: "baby-10-7", title: "Protected Sleep Window", description: "PLL gets a real sleep block." },
      { id: "baby-10-8", title: "Feeding Support Mode", description: "Gerrit handles every support task around feeds." },
      { id: "baby-10-9", title: "Reset the Day", description: "The day is restructured around helping PLL recover." },
      { id: "baby-10-10", title: "Couple Reward: Quiet Connection", description: "Use the next calm baby window for each other." },
    ],
    12: [
      { id: "baby-12-1", title: "Whole Day Baby-Free", description: "PLL gets a full day mostly off baby duty." },
      { id: "baby-12-2", title: "Sleep-In Deluxe", description: "PLL sleeps as long as possible. Gerrit takes point." },
      { id: "baby-12-3", title: "Recharge Half-Day", description: "PLL gets serious time back." },
      { id: "baby-12-4", title: "No Baby, No Chores, No Nonsense", description: "PLL receives top-tier relief." },
      { id: "baby-12-5", title: "Outing Alone", description: "PLL gets proper personal time away." },
      { id: "baby-12-6", title: "Gerrit Benefit: Dad Hero Mode", description: "Gerrit takes over and earns glory." },
      { id: "baby-12-7", title: "Meal + Baby + Laundry Sweep", description: "Gerrit handles the whole chaos bundle." },
      { id: "baby-12-8", title: "Protected Recovery Window", description: "PLL gets real uninterrupted recovery time." },
      { id: "baby-12-9", title: "Nap Fortress", description: "PLL’s nap becomes legally protected territory." },
      { id: "baby-12-10", title: "Couple Reward: Quiet Date at Home", description: "When the baby sleeps, you two matter too." },
      { id: "baby-12-11", title: "Stroller Expedition", description: "Gerrit disappears with baby so PLL can exhale." },
      { id: "baby-12-12", title: "Relief Package", description: "Multiple baby tasks are transferred to Gerrit." },
    ],
    20: [
      { id: "baby-20-1", title: "Legendary Day Off", description: "PLL gets the highest tier of relief available." },
      { id: "baby-20-2", title: "Double Relief", description: "Claim this, then roll again." },
      { id: "baby-20-3", title: "Sleep and Silence", description: "PLL gets premium recovery conditions." },
      { id: "baby-20-4", title: "Full Command Transfer", description: "Gerrit takes full control for a major block." },
      { id: "baby-20-5", title: "Couple Reward: Reconnect Window", description: "Use reclaimed time for each other, not just chores." },
      { id: "baby-20-6", title: "Gerrit Benefit: Legendary Dad Mode", description: "The dungeon AI expects heroics." },
      { id: "baby-20-7", title: "Choose Any Baby Reward", description: "PLL picks the exact relief she wants." },
    ],
  },
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function revealNarration(type, themeLabel, dieLabel) {
  const opener = randomItem(NARRATOR_OPENERS);

  if (type === "fail") {
    return `${opener}\n\n${randomItem(NARRATOR_FAIL)}`;
  }

  if (type === "legendary") {
    return `${opener}\n\nLegendary-tier nonsense has been authorized for ${themeLabel} on a d${dieLabel}.`;
  }

  return `${opener}\n\n${randomItem(NARRATOR_SUCCESS)}`;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState("love");
  const [die, setDie] = useState(6);
  const [rollInput, setRollInput] = useState("");
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [usedIds, setUsedIds] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("pll-love-quest-history");
    const savedUsed = localStorage.getItem("pll-love-quest-used");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedUsed) setUsedIds(JSON.parse(savedUsed));
  }, []);

  useEffect(() => {
    localStorage.setItem("pll-love-quest-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("pll-love-quest-used", JSON.stringify(usedIds));
  }, [usedIds]);

  const themeLabel = useMemo(
    () => THEMES.find((item) => item.key === theme)?.label ?? "Love Quest",
    [theme]
  );

  function pickReward(pool) {
    const available = pool.filter((item) => !usedIds.includes(item.id));
    if (available.length > 0) return randomItem(available);
    return randomItem(pool);
  }

  function handleReveal() {
    const roll = Number(rollInput);

    if (!Number.isInteger(roll) || roll < 1 || roll > die) {
      alert(`Enter a whole number between 1 and ${die}.`);
      return;
    }

    if (roll === 1) {
      const penalty = randomItem(PENALTIES);
      setCurrentResult({
        kind: "fail",
        roll,
        title: penalty.title,
        description: penalty.description,
        narration: revealNarration("fail", themeLabel, die),
        rewardId: null,
        chaos: null,
      });
      return;
    }

    if (die === 20 && roll === 20) {
      const reward = randomItem(LEGENDARY_REWARDS);
      const chaos = Math.random() < 0.05 ? randomItem(CHAOS_EVENTS) : null;

      setCurrentResult({
        kind: "legendary",
        roll,
        title: reward.title,
        description: reward.description,
        narration: revealNarration("legendary", themeLabel, die),
        rewardId: reward.id,
        chaos,
      });
      return;
    }

    const pool = REWARD_POOLS[theme][die];
    const reward = pickReward(pool);
    const chaos = Math.random() < 0.05 ? randomItem(CHAOS_EVENTS) : null;

    setCurrentResult({
      kind: "reward",
      roll,
      title: reward.title,
      description: reward.description,
      narration: revealNarration("reward", themeLabel, die),
      rewardId: reward.id,
      chaos,
    });
  }

  function handleClaim() {
    if (!currentResult) return;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toLocaleString(),
      theme: themeLabel,
      die: `d${die}`,
      roll: currentResult.roll,
      kind: currentResult.kind,
      title: currentResult.title,
      description: currentResult.description,
      chaos: currentResult.chaos?.title ?? null,
    };

    setHistory((prev) => [entry, ...prev].slice(0, 50));

    if (currentResult.rewardId && !usedIds.includes(currentResult.rewardId)) {
      setUsedIds((prev) => [...prev, currentResult.rewardId]);
    }

    setRollInput("");
    setCurrentResult(null);
  }

  function resetEverything() {
    if (!window.confirm("Reset all claimed history and used rewards?")) return;
    setHistory([]);
    setUsedIds([]);
    setCurrentResult(null);
    setRollInput("");
    localStorage.removeItem("pll-love-quest-history");
    localStorage.removeItem("pll-love-quest-used");
  }

  if (!started) {
    return (
      <div className="app-shell">
        <div className="welcome-card">
          <div className="welcome-badge">Dungeon AI Online</div>
          <h1>PLL&apos;s Love Quest</h1>
          <p className="welcome-text">
            Welcome, Paige. The Romance Engine has been initialized.
          </p>
          <p className="welcome-subtext">
            Outcomes include affection, chaos, and mild emotional manipulation. Roll wisely.
          </p>
          <button className="primary-btn" onClick={() => setStarted(true)}>
            Tap to Begin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="game-card">
        <div className="header">
          <div>
            <div className="eyebrow">Romance Engine: Online</div>
            <h1>PLL&apos;s Love Quest</h1>
            <p>
              Hidden rewards only. Naturally. Visible certainty is for cowards.
            </p>
          </div>
          <div className="heart-badge">♥</div>
        </div>

        <div className="section">
          <div className="section-label">Theme</div>
          <div className="pill-row">
            {THEMES.map((item) => (
              <button
                key={item.key}
                className={`pill ${theme === item.key ? "pill-active" : ""}`}
                onClick={() => {
                  setTheme(item.key);
                  setCurrentResult(null);
                  setRollInput("");
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-label">Choose Die</div>
          <div className="pill-row">
            {DICE.map((value) => (
              <button
                key={value}
                className={`pill ${die === value ? "pill-active" : ""}`}
                onClick={() => {
                  setDie(value);
                  setCurrentResult(null);
                  setRollInput("");
                }}
              >
                d{value}
              </button>
            ))}
          </div>
        </div>

        <div className="section input-card">
          <div className="section-label">Enter Physical Roll</div>
          <div className="roll-input-row">
            <input
              type="number"
              min="1"
              max={die}
              value={rollInput}
              onChange={(e) => setRollInput(e.target.value)}
              placeholder={`1-${die}`}
            />
            <button className="primary-btn" onClick={handleReveal}>
              Reveal Fate
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentResult && (
            <motion.div
              key={`${currentResult.kind}-${currentResult.title}-${currentResult.roll}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className={`result-card ${
                currentResult.kind === "fail"
                  ? "result-fail"
                  : currentResult.kind === "legendary"
                  ? "result-legendary"
                  : "result-reward"
              }`}
            >
              <div className="result-roll">
                Dice Result: {currentResult.roll} on d{die}
              </div>

              <pre className="narration">{currentResult.narration}</pre>

              <div className="result-title-wrap">
                <div className="result-tag">
                  {currentResult.kind === "fail"
                    ? "Critical Fail"
                    : currentResult.kind === "legendary"
                    ? "Legendary Success"
                    : "Reward Unlocked"}
                </div>
                <h2>{currentResult.title}</h2>
                <p>{currentResult.description}</p>
              </div>

              {currentResult.chaos && (
                <div className="chaos-box">
                  <div className="chaos-label">Chaos Event</div>
                  <div className="chaos-title">{currentResult.chaos.title}</div>
                  <div className="chaos-desc">
                    {randomItem(NARRATOR_CHAOS)} {currentResult.chaos.description}
                  </div>
                </div>
              )}

              <div className="button-row">
                <button className="primary-btn" onClick={handleClaim}>
                  {currentResult.kind === "fail" ? "Accept Fate" : "Claim Reward"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setCurrentResult(null);
                    setRollInput("");
                  }}
                >
                  Roll Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="section history-card">
          <div className="history-header">
            <div className="section-label">Claimed History</div>
            <button className="secondary-btn small-btn" onClick={resetEverything}>
              Reset All
            </button>
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              No rewards claimed yet. Frankly, that seems fixable.
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-meta">
                    {item.theme} • {item.die} • roll {item.roll} • {item.createdAt}
                  </div>
                  <div className="history-title">{item.title}</div>
                  <div className="history-desc">{item.description}</div>
                  {item.chaos ? (
                    <div className="history-chaos">Chaos Event: {item.chaos}</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footer-note">
          Rewards stay hidden until revealed. As they should.
        </div>
      </div>
    </div>
  );
}