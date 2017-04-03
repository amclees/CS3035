$(document).ready(function() {
  var mapWidth = 9;
  var mapHeight = 9;
  var gameOver = false;
  var pendingMessage = false;
  var allDiscovered = false;
  var wallDone = false;
  var numberOfWalls = 16;
  var playerBaseHp = 25;
  var playerBaseAc = 12;

  // Could use JQuery, but don't want it as a dependency later on so it is not used
  // JQuery would be done $("~")
  var inputBox = document.getElementById("input");
  var yesButton = document.getElementById("yes-button");
  var noButton = document.getElementById("no-button");
  var messageElement = document.getElementById("message");

  var northButton = document.getElementById("north-button");
  var westButton = document.getElementById("west-button");
  var eastButton = document.getElementById("east-button");
  var southButton = document.getElementById("south-button");

  /*
  Also could be done using JQuery's click(functionHere) method
  but it would then depend on JQuery, and buttons already have an attribute
  for a click handler.
  */
  northButton.onclick = function() {
    round("n");
  }
  westButton.onclick = function() {
    round("w");
  }
  eastButton.onclick = function() {
    round("e");
  }
  southButton.onclick = function() {
    round("s");
  }


  var negativeWords = ["abominable", "abominate", "abomination", "abort", "aborted", "aborts", "abrade", "abrasive", "abrupt", "abruptly", "abscond", "absence", "absent-minded", "absentee", "absurd", "absurdity", "absurdly", "abuse", "abused", "abuses", "abusive", "abysmal", "abysmally", "accidental", "accost", "accursed", "accusation", "accusations", "accuse", "accuses", "accusing", "acerbate", "acerbically", "ache", "ached", "aches", "achey", "aching", "acrid", "acridly", "acridness", "acrimonious", "acrimoniously", "adamant", "adamantly", "addict", "addicted", "addicting", "addicts", "admonish", "admonisher", "admonishment", "admonition", "adulterate", "adulterated", "adulteration", "adversarial", "adversary", "adverse", "adversity", "afflict", "affliction", "afflictive", "affront", "afraid", "aggravate", "aggravating", "aggravation", "aggression", "aggressive", "aggressiveness", "aggressor", "aggrieved", "aggrivation", "aghast", "agonies", "agonize", "agonizing", "agonizingly", "agony", "ail", "ailing", "ailment", "alarm", "alarmed", "alarmingly", "alienate", "alienated", "alienation", "allegation", "allegations", "allege", "allergic", "allergies", "allergy", "aloof", "altercation", "ambiguity", "ambiguous", "ambivalence", "ambivalent", "ambush", "amiss", "amputate", "anarchism", "anarchist", "anarchistic", "anarchy", "anemic", "anger", "angrily", "angriness", "angry", "anguish", "animosity", "annihilate", "annihilation", "annoy", "annoyance", "annoyances", "annoyed", "annoying", "annoyingly", "annoys", "anomaly", "antagonism", "antagonist", "antagonistic", "antagonize", "anti-", "anti-american", "anti-occupation", "anti-proliferation", "anti-semites", "anti-social", "anti-us", "antipathy", "antithetical", "anxieties", "anxiety", "anxious", "anxiously", "anxiousness", "apathetic", "apathetically", "apathy", "apocalypse", "apologist", "apologists", "appal", "appall", "appalled", "appalling", "apprehension", "apprehensions", "apprehensive", "apprehensively", "arbitrary", "arcane", "arduous", "arduously", "argumentative", "arrogance", "arrogant", "arrogantly", "ashamed", "asinine", "asininely", "asinininity", "askance", "asperse", "aspersion", "aspersions", "assail", "assassin", "assassinate", "assault", "assult", "astray", "asunder", "atrocious", "atrocity", "atrophy", "attack", "attacks", "audacious", "audaciously", "audacity", "austere", "authoritarian", "autocrat", "avalanche", "avarice", "avaricious", "avariciously", "avenge", "averse", "aweful", "awful", "awfully", "awfulness", "awkward", "awkwardness", "ax", "babble", "back-logged", "back-wood", "back-woods", "backache", "backaches", "backaching", "backbite", "backbiting", "backward", "backwardness", "backwood", "bad", "badly", "baffle", "baffled", "bafflement", "baffling", "bait", "banal", "banalize", "bane", "banish", "banishment", "bankrupt", "barbarian", "barbaric", "barbarically", "barbarous", "barren", "baseless", "bash", "bashed", "bashful", "bashing", "bastard", "bastards", "battered", "battering", "batty", "bearish", "beastly", "bedlam", "bedlamite", "befoul", "beg", "beggar", "beggarly", "begging", "beguile", "belabor", "belated", "beleaguer", "belie", "belittled", "belittling", "bellicose", "belligerence", "belligerent", "bemoan", "bemoaning", "bemused", "bent", "berate", "bereave", "bereavement", "bereft", "berserk", "beseech", "beset", "besiege", "besmirch", "betray", "betrayal", "betrayals", "betrayer", "betraying", "betrays", "bewail", "beware", "bewildered", "bewildering", "bewilderingly", "bewitch", "bias", "biased", "biases", "bicker", "bickering", "bid-rigging", "bigotries", "bigotry", "bitch", "bitchy", "biting", "bitingly", "bitter", "bitterness", "bizarre", "blab", "blabber", "blackmail", "blah", "blame", "blameworthy", "blandish", "blaspheme", "blasphemous", "blasphemy", "blasted", "blatant", "blather", "bleak", "bleakly", "bleakness", "bleed", "bleeding", "bleeds", "blemish", "blind", "blindingly", "blindside", "blister", "blistering", "bloated", "blockage", "blockhead", "bloodthirsty", "bloody", "blotchy", "blow", "blunder", "blundering", "blunders", "blunt", "blur", "bluring", "blurred", "blurring", "blurry", "blurs", "blurt", "boastful", "boggle", "bogus", "boil", "boiling", "boisterous", "bomb", "bombard", "bombardment", "bombastic", "bondage", "bonkers", "bore", "bored", "boredom", "bores", "boring", "botch", "bother"
  , "bothering", "bothers", "bothersome", "bowdlerize", "boycott", "braggart", "bragger", "brainless", "brash", "brashly", "brashness", "brat", "bravado", "brazen", "brazenly", "brazenness", "breach", "break", "break-up", "break-ups", "breakdown", "breaking", "breaks", "breakup", "breakups", "bribery", "brimstone", "brittle", "broke", "broken", "broken-hearted", "brood", "browbeat", "bruise", "bruised", "bruises", "bruising", "brusque", "brutal", "brutalising", "brutalities", "brutality", "brutalize", "brutalizing", "brute", "brutish", "bs", "buckle", "bug", "bugging", "bugs", "bulkier", "bulkiness", "bulkyness", "bull****", "bull----", "bullies", "bullshit", "bullshyt", "bully", "bullying", "bullyingly", "bum", "bump", "bumpping", "bumps", "bumpy", "bungle", "bungler", "bungling", "bunk", "burden", "burdensome", "burdensomely", "burn", "burned", "burning", "bust", "busts", "busybody", "butcher", "butchery", "buzzing", "byzantine", "cackle", "calamities", "calamitously", "calamity", "callous", "calumniate", "calumniation", "calumnies", "calumnious", "calumniously", "calumny", "cancerous", "cannibal", "cannibalize", "capitulate", "capricious", "capriciously", "capsize", "careless", "carelessness", "caricature", "carnage", "carp", "cartoonish", "cash-strapped", "castigate", "castrated", "casualty", "cataclysmal", "cataclysmic", "cataclysmically", "catastrophe", "catastrophes", "catastrophic", "catastrophically", "caustic", "caustically", "cautionary", "cave", "censure", "chafe", "chaff", "chagrin", "challenging", "chaos", "chasten", "chastise", "chastisement", "chatter", "cheap", "cheaply", "cheat", "cheated", "cheater", "cheating", "checkered", "cheerless", "cheesy", "childish", "chill", "chilly", "chintzy", "choke", "choleric", "choppy", "chronic", "chunky", "clamor", "clamorous", "clash", "cliche", "cliched", "clique", "clogged", "clogs", "clouding", "cloudy", "clueless", "clumsy", "clunky", "coarse", "cocky", "coerce", "coercion", "coercive", "cold", "coldly", "collapse", "collude", "collusion", "combust", "comical", "commonplace", "commotion", "commotions", "complacent", "complain", "complained", "complaining", "complains", "complaint", "complaints", "complex", "complicated", "complication", "complicit", "compulsive", "concede", "conceded", "conceit", "conceited", "concens", "concern", "concerns", "concession", "concessions", "condemn", "condemnable", "condemnation", "condemned", "condemns", "condescend", "condescending", "condescendingly", "condescension", "confess", "confession", "confessions", "confined", "conflict", "conflicted", "conflicting", "conflicts", "confound", "confounded", "confounding", "confront", "confrontation", "confrontational", "confuse", "confuses", "confusing", "confusion", "confusions", "congested", "congestion", "cons", "conscons", "conservative", "conspicuously", "conspiracies", "conspiracy", "conspirator", "conspiratorial", "conspire", "consternation", "contagious", "contaminate", "contaminated", "contaminates", "contaminating", "contempt", "contemptible", "contemptuous", "contemptuously", "contend", "contention", "contentious", "contort", "contradiction", "contradictory", "contrariness", "contravene", "contrive", "contrived", "controversy", "convoluted", "corrosion", "corrosions", "corrosive", "corrupt", "corrupted", "corrupting", "corrupts", "corruptted", "costlier", "costly", "counter-productive", "counterproductive", "coupists", "covetous", "coward", "cowardly", "crabby", "cracked", "craftily", "craftly", "crafty", "cramped", "cramping", "cranky", "crap", "crappy", "craps", "crashed", "crashes", "crashing", "crass", "craven", "craze", "crazily", "craziness", "crazy", "creak", "creaking", "creaks", "credulous", "creep", "creeping", "creeps", "creepy", "crept", "crime", "criminal", "cringe", "cringed", "cringes", "crippled", "cripples", "crippling", "crisis", "critic", "critical", "criticism", "criticisms", "criticize", "criticized", "criticizing", "critics", "cronyism", "crook", "crooked", "crooks", "crowded", "crowdedness", "crude", "cruel", "cruelest", "cruelly", "cruelness", "cruelties", "cruelty", "crumble", "crumbling", "crummy", "crumple", "crumples", "crush", "crushing", "cry", "culpable", "culprit", "cumbersome", "cunt", "cuplrit", "curse", "cursed", "curses", "curt", "cussed", "cutthroat", "cynical", "cynicism", "d*mn", "damage", "damaged", "damages", "damaging", "damn", "damnable", "damnably", "damned", "damning", "damper", "danger", "dangerous", "dangerousness", "dark", "darken", "darkened", "darker", "darkness", "dastard", "dastardly", "daunt", "dauntingly", "dawdle", "daze", "dazed", "dead", "deadbeat", "deadlock", "deadly", "deadweight", "deaf", "dearth", "death", "debacle", "debase", "debasement", "debaser", "debatable", "debauch", "debaucher", "debauchery", "debilitate", "debility", "debt", "debts", "decadence", "decadent", "decayed", "deceit", "deceitful", "deceitfulness", "deceive", "deceiver", "deceivers", "deceiving", "deception", "deceptive", "deceptively", "declaim", "decline", "declines", "declining", "decrement", "decrepit", "decrepitude", "decry", "defamation", "defamations", "defamatory", "defame", "defective", "defensive", "defiant", "defiantly", "deficiencies", "deficiency", "deficient", "defile", "defiler", "deform", "deformed", "defrauding", "defunct", "defy", "degenerate", "degenerately", "degrading", "dehumanization", "dehumanize", "deign", "deject", "dejected", "dejectedly", "delay", "delayed", "delaying", "delays", "delinquency", "delinquent", "delirious", "delirium", "delude", "deluded", "delusion", "delusional", "delusions", "demean", "demeaning", "demise", "demolish", "demolisher", "demon", "demonic", "demonize", "demonized", "demonizes", "demonizing", "demoralize", "demoralizing", "demoralizingly", "denial", "denied", "denies", "denigrate", "denounce", "dense", "dent", "dented", "dents", "denunciate", "denunciation", "denunciations", "denying", "deplete", "deplorably", "deplore", "deploring", "deploringly", "deprave", "depraved", "depravedly", "deprecate", "depress", "depressed", "depressing", "depressingly", "depression", "depressions", "deprive", "deride", "derision", "derisive", "derisively", "derisiveness", "derogatory", "desecrate", "desert", "desertion", "desiccate", "desititute", "desolate", "desolation", "despair", "despairing", "despairingly", "desperate", "desperately", "despicable", "despicably", "despise", "despised", "despoil", "despoiler", "despondency", "despondent", "despot", "despotic", "despotism", "destabilisation", "destains", "destitute", "destroy", "destroyer", "destructive", "desultory", "deter", "deteriorate", "deteriorating", "deterioration", "deterrent", "detest", "detestable", "detested", "detesting", "detract", "detracted", "detracting", "detraction", "detracts", "detriment", "detrimental", "devastate", "devastated", "devastates",
   "devastating", "devastatingly", "devastation", "deviate", "devil", "devilish", "devilishly", "devilment", "devilry", "devious", "deviously", "devoid", "diabolic", "diabolically", "diametrically", "diappointed", "diatribe", "diatribes", "dick", "dictator", "dictatorial", "die", "die-hard", "died", "dies", "difficult", "difficulty", "diffidence", "dilapidated", "dilly-dally", "dim", "dimmer", "din", "ding", "dinky", "dire", "direly", "dirtbag", "dirtbags", "dirts", "disable", "disabled", "disaccord", "disadvantage", "disadvantaged", "disaffect", "disaffected", "disaffirm", "disagree", "disagreeable", "disagreeably", "disagreed", "disagreeing", "disagreement", "disagrees", "disallow", "disapointed", "disapointment", "disappoint", "disappointed", "disappointing", "disappointingly", "disappointment", "disappoints", "disapprobation", "disapproval", "disapprove", "disapproving", "disarm", "disarray", "disasterous", "disastrous", "disastrously", "disavow", "disavowal", "disbelief", "disbelieve", "disbeliever", "discombobulate", "discomfit", "discomfititure", "discomfort", "discompose", "disconcert", "disconcerted", "disconcerting", "disconcertingly", "disconsolate", "disconsolately", "disconsolation", "discontent", "discontented", "discontentedly", "discontinued", "discontinuity", "discontinuous", "discord", "discordance", "discordant", "discountenance", "discouragement", "discouraging", "discouragingly", "discourteous", "discourteously", "discoutinous", "discredit", "discrepant", "discriminate", "discrimination", "discriminatory", "disdain", "disdained", "disdainfully", "disfavor", "disgrace", "disgraced", "disgraceful", "disgracefully", "disgruntle", "disgruntled", "disgust", "disgusted", "disgustedly", "disgustful", "disgustfully", "disgusting", "disgustingly", "dishearten", "disheartening", "dishonest", "dishonestly", "dishonor", "dishonorable", "disillusion", "disillusioned", "disillusions", "disinclination", "disingenuously", "disintegrate", "disintegrated", "disintegrates", "disintegration", "disinterest", "disinterested", "dislike", "disliked", "dislikes", "disliking", "dislocated", "disloyal", "disloyalty", "dismal", "dismally", "dismalness", "dismay", "dismayed", "dismaying", "dismayingly", "dismissive", "dismissively", "disobedience", "disobey", "disorder", "disordered", "disorderly", "disorganized", "disorient", "disoriented", "disown", "disparage", "disparaging", "disparagingly", "dispensable", "dispirit", "dispirited", "dispiritedly", "displace", "displaced", "displease", "displeasing", "disproportionate", "disprove", "disputable", "dispute", "disputed", "disquiet", "disquieting", "disquietingly", "disquietude", "disregardful", "disreputable", "disrepute", "disrespectable", "disrespectablity", "disrespectful", "disrespectfulness", "disrespecting", "disrupt", "disruption", "disruptive", "diss", "dissapointed", "dissappointed", "dissappointing", "dissatisfaction", "dissatisfactory", "dissatisfied", "dissatisfies", "dissatisfy", "dissatisfying", "dissed", "dissemble", "dissembler", "dissent", "dissenter", "dissention", "disservice", "disses", "dissidence", "dissident", "dissidents", "dissing", "dissocial", "dissolute", "dissolution", "dissonance", "dissonant", "dissuasive", "distains", "distaste", "distasteful", "distastefully", "distort", "distorted", "distortion", "distorts", "distract", "distracting", "distraction", "distraught", "distraughtly", "distraughtness", "distress", "distressed", "distressing", "distressingly", "distrust", "distrustful", "distrusting", "disturb", "disturbance", "disturbed", "disturbing", "disturbingly", "disunity", "disvalue", "divergent", "divisive", "divisively", "divisiveness", "dizzingly", "dizzy", "dodgey", "dogged", "doggedly", "dogmatic", "doldrums", "domineering", "doom", "doomed", "dope", "doubt", "doubtful", "doubtfully", "doubts", "douchbag", "douchebag", "douchebags", "downbeat", "downcast", "downer", "downfall", "downfallen", "downgrade", "downhearted", "downheartedly", "downhill", "downside", "downsides", "downturn", "downturns", "drab", "draconian", "draconic", "drag", "dragged", "dragging", "dragoon", "drags", "drain", "drained", "draining", "drains", "drastic", "drastically", "drawback", "drawbacks", "dread", "dreadful", "dreadfully", "dreadfulness", "dreary", "dripped", "dripping", "drippy", "drips", "drones", "droop", "droops", "drop-out", "dropout", "drought", "drowning", "drunk", "drunkard", "drunken", "dubious", "dubiously", "dubitable", "dull", "dullard", "dumb", "dumbfound", "dumped", "dumping", "dunce", "dungeon", "dungeons", "dupe", "dust", "dusty", "dwindling", "dying", "earsplitting", "eccentric", "eccentricity", "effigy", "effrontery", "egomania", "egotism", "egotistically", "egregious", "egregiously", "election-rigger", "elimination", "emaciated", "embarrass", "embarrassing", "embarrassingly", "embarrassment", "embattled", "embroil", "embroiled", "emergency", "emphatic", "emphatically", "emptiness", "encroach", "encroachment", "endanger", "enemies", "enemy", "enervate", "enfeeble", "enflame", "engulf", "enjoin", "enrage", "enraged", "enraging", "enslave", "entangle", "entanglement", "entrap", "entrapment", "envious", "enviously", "enviousness", "epidemic", "equivocal", "erase", "erode", "erodes", "err", "errant", "erratic", "erroneous", "erroneously", "errors", "eruptions", "escapade", "eschew", "estranged", "evasion", "evasive", "evildoer", "evils", "eviscerate", "exacerbate", "exagerate", "exagerated", "exagerates", "exaggerate", "exaggeration", "exasperate", "exasperated", "exasperating", "exasperatingly", "excessive", "excessively", "exclusion", "excoriate", "excruciating", "excruciatingly", "excuse", "excuses", "execrate", "exhaust", "exhaustion", "exhausts", "exhorbitant", "exile", "exorbitant", "exorbitantance", "exorbitantly", "expel", "expensive", "expire", "expired", "explode", "exploit", "exploitation", "explosive", "expropriation", "expulse", "expunge", "extermination", "extinguish", "extort", "extortion", "extraneous", "extravagance", "extravagant", "extravagantly", "extremism", "extremist", "extremists", "eyesore", "f**k", "fabricate", "fabrication", "facetious", "facetiously", "fail", "failing", "fails", "failures", "faint", "fainthearted", "faithless", "fake", "fall", "fallacies", "fallacious", "fallaciously", "fallaciousness", "fallacy", "fallen", "falling", "fallout", "falls", "false", "falsehood", "falsely", "falsify", "falter", "faltered", "famine", "famished", "fanatic", "fanatical", "fanatically", "fanaticism", "fanatics", "fanciful", "far-fetched", "farce", "farcical", "farcical-yet-provocative", "farcically", "farfetched", "fascism", "fastidious", "fastidiously", "fastuous", "fat", "fat-cat", "fat-cats", "fatal", "fatalistically", "fatcat", "fatcats", "fatefully", "fathomless", "fatigue", "fatigued", "fatique", "fatty", "fatuity", "fatuous", "fault", "faults", "faulty", "fawningly", "faze", "fear", "fearful", "fearsome", "feckless", "feeblely", "feebleminded", "feint", "fell", "felon", "felonious", "ferociously", "ferocity", "fetid", "fever", "feverish", "fevers", "fiasco", "fib", "fickle", "fiction", "fictional", "fictitious", "fidget", "fidgety", "fiend", "fiendish", "figurehead", "filth", "finagle", "finicky", "fissures", "fist", "flabbergast", "flabbergasted", "flagrantly", "flair", "flairs", "flak", "flakey", "flakieness", "flaking", "flaky", "flare", "flares", "flareup", "flareups", "flaunt", "flaws", "flee", "fleed", "fleeing", "flees", "fleeting", "flicering", "flicker", "flickering", "flickers", "flighty", "flimflam", "flimsy", "flirty", "floored", "floundering", "flout", "fluster", "foe", "fool", "fooled", "foolhardy", "foolish", "foolishly", "foolishness", "forbid", "forbidden", "forbidding", "forceful", "foreboding", "forebodingly", "forged", "forgetful", "forgetfully", "forgetfulness", "forlorn", "forlornly", "forsake", "forswear", "foul", "foully", "foulness", "fractious", "fractiously", "fracture", "fragile", "fragmented", "frantic", "frantically", "fraud", "fraudulent", "fraught", "frazzled", "freak", "freaking", "freakish", "freakishly", "freaks", "freeze", "freezes", "freezing", "frenetic", "frenetically", "frenzy", "fret", "fretful", "frets", "friction", "frictions", "fried", "friggin", "frigging", "fright", "frighten", "frightening", "frighteningly", "frightfully", "frost", "frown", "froze", "frozen", "fruitless", "fruitlessly", "frustrate", "frustrated", "frustrates", "frustrating", "frustratingly", "frustrations", "fucking", "fudge", "fugitive", "full-blown", "fulminate", "fume", "fumes", "fundamentalism", "funky", "funnily", "funny", "furious", "furiously", "furor", "fury", "fussy", "fusty", "futile", "futilely", "fuzzy", "gabble", "gainsay", "gainsayer", "gall", "galling", "gallingly", "galls", "gangster", "gape", "garbage", "garish", "gasp", "gaudy", "gawk", "gawky", "geezer", "genocide", "get-rich", "ghastly", "ghetto", "ghosting", "gibber", "gibberish", "gibe", "giddy", "gimmick", "gimmicked", "gimmicking", "gimmicks", "gimmicky", "glare", "glaringly", "glib", "glibly", "glitch", "glitches", "gloatingly", "gloom", "gloomy", "glum", "glut", "gnawing", "goad", "goading", "god-awful", "goof", "goofy", "goon", "gossip", "graceless", "gracelessly", "graft", "grainy", "grapple", "grate", "grating", "gravely", "greasy", "greed", "greedy", "grievance", "grievances", "grieve", "grievously", "grim", "grimace", "grind", "gripe", "gripes", "grisly", "gritty", "gross", "grossly", "grotesque", "grouch", "grouchy", "groundless", "grouse", "growl", "grudge", "grudges", "grudging", "grudgingly", "gruesome", "gruesomely", "gruff", "grumpier", "grumpiest", "grumpily", "grumpish", "guile", "guilt", "guiltily", "guilty", "gullible", "gutless", "hack", "haggard", "hairloss", "halfheartedly", "hallucinate", "hallucination", "hamper", "handicapped", "hang", "hangs", "haphazard", "hapless", "harangue", "harass", "harassed", "harasses", "harboring", "hard-hit", "hard-line", "hard-liner", "hardball", "hardened", "hardheaded", "hardhearted", "hardliner", "hardliners", "hardship", "hardships", "harm", "harmful", "harms", "harpy", "harridan", "harried", "harrow", "harsh", "hasseling", "hassle", "hassled", "hassles", "hastily", "hasty", "hate", "hated", "hateful", "hatefully", "hatefulness", "hater", "haters", "hates", "hatred", "haughtily", "haughty", "haunt", "haunting", "havoc", "hawkish", "haywire", "hazard", "hazardous", "hazy", "head-aches", "headaches", "heartbreaker", "heartbreaking", "heartless", "heathen", "heavy-handed", "heavyhearted", "heck", "heckle", "heckled", "hectic", "hedge", "heedless", "hefty", "hegemonism", "hegemonistic", "hegemony", "heinous", "hell", "hell-bent", "hellion", "hells", "helpless", "helplessly", "helplessness", "heresy", "heretic", "heretical", "hesitant", "hideous", "hideously", "hideousness", "high-priced", "hiliarious", "hinder", "hindrance", "hiss", "hissed", "hissing", "ho-hum", "hoard", "hoax", "hobble", "hogs", "hollow", "hoodium", "hoodwink", "hooligan", "hopeless", "hopelessly", "hopelessness", "horde", "horrendous", "horrendously", "horrible", "horrid", "horrific", "horrified", "horrifies", "horrify", "horrifying", "horrifys", "hostile", "hostilities", "hostility", "hotbeds", "hotheaded", "hothouse", "hubris", "huckster", "hum", "humid", "humiliate", "humiliating", "humiliation", "humming", "hung", "hurt", "hurted", "hurtful", "hurting", "hurts", "hustler", "hype", "hypocrisy", "hypocrite", "hypocrites", "hypocritical", "hysteria", "hysteric", "hysterical", "hysterically", "hysterics", "idiocies", "idiocy", "idiot", "idiotically", "idiots", "idle", "ignoble", "ignominious", "ignominiously", "ignominy", "ignorance", "ignorant", "ignore", "ill-advised", "ill-conceived", "ill-defined", "ill-designed", "ill-fated", "ill-favored", "ill-formed", "ill-mannered", "ill-natured", "ill-sorted", "ill-tempered", "ill-treatment", "ill-usage", "ill-used", "illegal", "illegally", "illegitimate", "illicit", "illiterate", "illness", "illogical", "illogically", "illusion", "illusions", "illusory", "imaginary", "imbalance", "imbecile", "imbroglio", "immaterial", "immature", "imminently", "immobilized", "immoderate", "immoderately", "immodest", "immorality", "immorally", "immovable", "impair", "impaired", "impasse", "impatience", "impatient", "impatiently", "impeach", "impedance", "impede", "impediment", "impenitent", "imperfect", "imperfection",
    "imperfections", "imperfectly", "imperialist", "imperil", "imperious", "imperiously", "impermissible", "impersonal", "impertinent", "impetuously", "impiety", "impious", "implacable", "implausible", "implausibly", "implicate", "implication", "implode", "impolite", "impolitely", "impolitic", "importunate", "impose", "imposing", "imposition", "impossible", "impossiblity", "impossibly", "impotent", "impoverish", "impoverished", "imprecate", "imprecise", "imprecisely", "imprecision", "imprison", "imprisonment", "improbability", "improbable", "improbably", "improper", "improperly", "impropriety", "imprudence", "imprudent", "impudence", "impudent", "impudently", "impugn", "impulsive", "impulsively", "impunity", "impure", "impurity", "inability", "inaccuracies", "inaccuracy", "inaccurate", "inaccurately", "inaction", "inactive", "inadequacy", "inadequate", "inadequately", "inadverent", "inadverently", "inadvisable", "inadvisably", "inanely", "inappropriately", "inapt", "inaptitude", "inarticulate", "inattentive", "inaudible", "incapable", "incapably", "incautious", "incendiary", "incense", "incessant", "incessantly", "incite", "incivility", "inclement", "incognizant", "incoherence", "incoherent", "incoherently", "incommensurate", "incomparable", "incomparably", "incompatability", "incompatibility", "incompatible", "incompetence", "incompetent", "incompetently", "incompliant", "incomprehensible", "incomprehension", "inconceivable", "inconceivably", "incongruous", "incongruously", "inconsequent", "inconsequential", "inconsequentially", "inconsequently", "inconsiderate", "inconsistence", "inconsistencies", "inconsistent", "inconsolable", "inconsolably", "inconstant", "inconvenience", "inconveniently", "incorrect", "incorrectly", "incorrigible", "incorrigibly", "incredulous", "incredulously", "inculcate", "indecency", "indecent", "indecently", "indecision", "indecisive", "indecisively", "indecorum", "indefensible", "indelicate", "indeterminably", "indeterminate", "indifference", "indifferent", "indigent", "indignantly", "indignation", "indignity", "indiscernible", "indiscreet", "indiscreetly", "indiscretion", "indiscriminate", "indiscriminately", "indiscriminating", "indistinguishable", "indoctrinate", "indoctrination", "indolent", "indulge", "ineffective", "ineffectively", "ineffectiveness", "ineffectual", "ineffectually", "ineffectualness", "inefficacious", "inefficiency", "inefficient", "inefficiently", "inelegance", "inelegant", "ineligible", "ineloquent", "ineloquently", "inept", "ineptly", "inequalities", "inequality", "inequitable", "inequitably", "inequities", "inescapably", "inessential", "inevitable", "inevitably", "inexcusable", "inexcusably", "inexorable", "inexorably", "inexperience", "inexperienced", "inexpert", "inexpertly", "inexpiable", "inextricable", "inextricably", "infamous", "infamy", "infected", "infection", "infections", "inferior", "inferiority", "infernal", "infested", "infidel", "infidels", "infiltrator", "infiltrators", "inflame", "inflammation", "inflammatory", "inflammed", "inflated", "inflexible", "inflict", "infraction", "infringe", "infringement", "infuriate", "infuriated", "infuriating", "infuriatingly", "inglorious", "ingrate", "ingratitude", "inhibit", "inhibition", "inhospitable", "inhospitality", "inhuman", "inhumane", "inhumanity", "inimical", "inimically", "iniquitous", "iniquity", "injure", "injurious", "injury", "injustice", "injustices", "innuendo", "inoperable", "inopportune", "inordinate", "inordinately", "insane", "insanely", "insanity", "insecure", "insecurity", "insensible", "insensitive", "insensitively", "insensitivity", "insignificance", "insignificant", "insincere", "insincerely", "insincerity", "insinuate", "insinuating", "insociable", "insolence", "insolently", "insolvent", "insouciance", "instability", "instable", "instigate", "instigator", "instigators", "insubordinate", "insubstantial", "insubstantially", "insufferable", "insufferably", "insufficiency", "insufficient", "insufficiently", "insular", "insult", "insulted", "insulting", "insultingly", "insupportable", "insurmountably", "insurrection", "intefere", "inteferes", "intense", "interfere", "interference", "interferes", "intermittent", "interrupt", "interruption", "interruptions", "intimidate", "intimidating", "intimidation", "intolerable", "intolerance", "intoxicate", "intractable", "intransigence", "intransigent", "intrude", "intrusive", "inundate", "inundated", "invader", "invalid", "invalidity", "invasive", "invective", "inveigle", "invidious", "invidiously", "invisible", "involuntary", "irascible", "irate", "irately", "ire", "irk", "irked", "irking", "irks", "irksome", "irksomely", "irksomeness", "irksomenesses", "ironic", "ironical", "ironically", "irony", "irragularity", "irrationalities", "irrationality", "irrationally", "irrationals", "irreconcilable", "irrecoverable", "irrecoverableness", "irrecoverablenesses", "irrecoverably", "irredeemable", "irredeemably", "irregular", "irregularity", "irrelevance", "irrelevant", "irreparable", "irreplacible", "irrepressible", "irresolute", "irresolvable", "irresponsible", "irresponsibly", "irretating", "irretrievable", "irreversible", "irritable", "irritably", "irritant", "irritate", "irritated", "irritating", "irritation", "irritations", "isolate", "isolated", "isolation", "issue", "issues", "itch", "itchy", "jabber", "jaded", "jam", "jarring", "jaundiced", "jealous", "jealously", "jealousness", "jealousy", "jeering", "jeeringly", "jeopardize", "jeopardy", "jerk", "jerky", "jitter", "jittery", "job-killing", "jobless", "joke", "joker", "jolt", "judder", "juddering", "judders", "jumpy", "junk", "junky", "junkyard", "jutter", "jutters", "kill", "killed", "killer", "killing", "killjoy", "kills", "knave", "knife", "knotted", "kook", "kooky", "lack", "lackadaisical", "lacked", "lackey", "lackeys", "lacking", "lackluster", "lacks", "laconic", "lag", "lagged", "lagging", "lags", "laid-off", "lambast", "lambaste", "lame", "lame-duck", "lamentable", "lamentably", "languid", "languish", "languorous", "languorously", "lanky", "lapse", "lapsed", "lapses", "lascivious", "last-ditch", "latency", "laughable", "laughably", "laughingstock", "lawbreaker", "lawbreaking", "lawless", "lawlessness", "lazy", "leak", "leakage", "leakages", "leaks", "lech", "lecher", "lecherous", "lechery", "leech", "leer", "leery", "lemon", "lengthy", "less-developed", "lesser-known", "letch", "lethargic", "lethargy", "lewd", "lewdly", "liability", "liable", "liars", "licentiously", "licentiousness", "lie", "lied", "lier", "lies", "life-threatening", "lifeless", "limit", "limitation", "limitations", "limited", "limits", "limp", "listless", "litigious", "little-known", "livid", "lividly", "loath", "loathe", "loathing", "loathly", "loathsome", "loathsomely", "lone", "loneliness", "lonely", "lonesome", "long-time", "long-winded", "longing", "longingly", "loophole", "loopholes", "loose", "loot", "lorn", "lose", "loser", "losers", "loses", "losing", "loss", "losses", "lost", "loud", "louder", "lousy", "loveless", "lovelorn", "low-rated", "lowly", "ludicrous", "ludicrously", "lugubrious", "lukewarm", "lull", "lumpy", "lunatic", "lunaticism", "lurch", "lure", "lurid", "lurk", "lurking", "lying", "macabre", "mad", "madden", "maddening", "maddeningly", "madder", "madly", "madman", "madness", "maladjusted", "maladjustment", "malady", "malaise", "malcontent", "malcontented", "maledict", "malevolence", "malevolent", "malevolently", "malice", "malicious", "maliciously", "malignant", "malodorous", "maltreatment", "mangle", "mangled", "mangling", "mania", "maniac", "maniacal", "manic", "manipulation", "manipulative", "manipulators", "mar", "marginal", "marginally", "martyrdom", "martyrdom-seeking", "massacre", "massacres", "matte", "mawkish", "mawkishly", "mawkishness", "meager", "meaningless", "meanness", "measly", "meddlesome", "mediocre", "mediocrity", "melancholy", "melodramatic", "melodramatically", "meltdown", "menacing", "menacingly", "mendacious", "mendacity", "menial", "merciless", "mercilessly", "mess", "messes", "messing", "messy", "midget", "miff", "militancy", "mindless", "mirage", "mire", "misalign", "misaligned", "misaligns", "misapprehend", "misbecome", "misbecoming", "misbegotten", "misbehave", "misbehavior", "miscalculate", "miscellaneous", "mischief", "mischievous", "mischievously", "misconception", "misconceptions", "miscreant", "miscreants", "misdirection", "miser", "miserable", "miserably", "miseries", "miserly", "misery", "misfit", "misfortune", "misgiving", "misgivings", "misguidance", "misguide", "mishandle", "mishap", "misinterpret", "misjudge", "misjudgment", "mislead", "misleading", "mislike", "mismanage", "mispronounce", "mispronounced", "misreading", "misrepresent", "misrepresentation", "miss", "missed", "misses", "misstatement", "mist", "mistake", "mistaken", "mistakenly", "mistakes", "mistified", "mistress", "mistrust", "mistrustful", "mistrustfully", "mists", "misunderstand", "misunderstanding", "misunderstandings", "misunderstood", "misuse", "moan", "mobster", "mock", "mocked", "mockery", "mocking", "mockingly", "mocks", "molest", "monotonous", "monotony", "monster", "monstrosities", "monstrosity", "monstrous", "monstrously", "moody", "moot", "mope", "morbid", "morbidly", "mordant", "mordantly", "moribund", "moron", "moronic", "morons", "mortification", "mortified", "mortify", "mortifying", "motionless", "mourn", "mourner", "mournful", "mournfully", "muddle", "muddy", "mudslinger", "mudslinging", "mulish", "multi-polarization", "mundane", "murder", "murderer", "murderous", "murderously", "murky", "muscle-flexing", "mushy", "musty", "mysterious", "mysteriously", "mystery", "myth", "nag", "nagging", "naive", "naively", "narrower", "nastily", "nastiness", "naughty", "nauseates", "nauseatingy", "na�ve", "nebulous", "nebulously", "needless", "needlessly", "needy", "nefarious", "nefariously", "negate", "negation", "negative", "negatives", "negativity", "neglect", "neglected", "negligence", "negligent", "nepotism", "nervous", "nervously", "nervousness", "nettlesome", "neurotic", "neurotically", "niggle", "niggles", "nightmarishly", "nitpick", "nitpicking", "noise", "noises", "noisier", "noisy", "non-confidence", "nonexistent", "nonresponsive", "nosey", "notoriety", "notorious", "notoriously", "noxious", "nuisance", "numb", "obese", "object", "objection", "objectionable", "objections", "oblique", "obliterate", "obliterated", "oblivious", "obnoxious", "obscene", "obscenely", "obscenity", "obscured", "obscurity", "obsess", "obsessive", "obsessively", "obsessiveness", "obstacle", "obstinate", "obstruct", "obstructed", "obstructing", "obstruction", "obstructs", "obtrusive", "occlude", "occluded", "occludes", "occluding", "odd", "odder", "oddest", "oddities", "oddity", "oddly", "odor", "offence", "offend", "offender", "offending", "offenses", "offensive", "offensively", "offensiveness", "officious", "ominous", "ominously", "omission", "omit", "one-sided", "onerously", "onslaught", "opinionated", "opponent", "opportunistic", "oppose", "opposition", "oppositions", "oppress", "oppression", "oppressive", "oppressively", "oppressiveness", "oppressors", "orphan", "ostracize", "outbreak", "outburst", "outcast", "outcry", "outlaw", "outmoded", "outrage", "outrageous", "outrageously", "outrageousness", "outrages", "outsider", "over-awe", "over-balanced", "over-hyped", "over-priced", "over-valuation", "overact", "overacted", "overawe", "overbalance", "overbalanced", "overbearing", "overblown", "overdo", "overdone", "overdue", "overemphasize", "overheat", "overkill", "overloaded", "overlook", "overpaid", "overpayed", "overplay", "overpower", "overrated", "overrun", "overshadow", "oversights", "oversimplification", "oversimplified", "oversimplify", "oversize", "overstate", "overstated", "overstatement", "overstatements", "overstates", "overthrow", "overthrows", "overturn", "overweight", "overwhelm", "overwhelmed", "overwhelming", "overwhelmingly", "overwhelms", "overzealous", "overzealously", "overzelous", "painful", "painfull", "painfully", "pains", "pale", "pales", "paltry", "pan", "pandemonium", "pander", "pandering", "panders", "panic", "panick", "panicked", "panicking", "panicky", "paradoxical", "paradoxically", "paralize", "paranoia", "parasite", "pariah", "parody", "partisan", "partisans", "passe", "passive", "passiveness", "pathetic", "pathetically", "patronize", "paucity", "pauper", "paupers", "payback", "peculiar", "pedantic", "peeled", "peeve", "peeved", "peevish", "peevishly", "penalize", "perfidious", "perfidity", "perfunctory", "peril", "perilous", "perilously", "perish", "pernicious", "perplex", "perplexed", "perplexing", "perplexity", "persecute", "persecution", "pertinacious", "pertinaciously", "pertinacity", "perturb", "perturbed", "perverse", "perversely", "perversion", "perversity", "pervert", "perverted", "perverts", "pessimism", "pessimistically", "pest", "pestilent", "petrified", "pettifog", "petty", "phobia", "phobic", "phony", "picket", "picketed", "picketing", "pickets", "picky", "pig", "pigs", "pillage", "pillory", "pimple", "pinch", "pique", "pitiable", "pitiful", "pitiless", "pitilessly", "pity", "plague", "plasticky", "plaything", "plea", "pleas", "plebeian", "plight", "plot", "plotters", "ploy", "plunder", "pointless", "poison", "poisonous", "poisonously", "poky", "polarisation", "polemize", "pollute", "polluter", "polluters", "polution", "poor", "poorer", "poorest", "poorly", "posturing", "poverty", "prate", "pratfall", "prattle", "precarious", "precariously", "precipitate", "precipitous", "predatory", "predicament", "prejudge", "prejudice", "prejudices", "prejudicial", "premeditated", "preoccupy", "preposterous", "preposterously", "presumptuous", "presumptuously", "pretence", "pretend", "pretense", "pretentious", "pretentiously", "prevaricate", "pricey", "prick", "prickle", "prickles", "prik", "primitive", "prison", "prisoner", "problem", "problematic", "problems", "procrastinate", "procrastinates", "procrastination", "profane", "profanity", "prohibit", "prohibitive", "prohibitively", "propaganda", "propagandize", "proprietary", "prosecute", "protested", "protesting", "protests", "provocation", "provocative", "provoke", "pry", "pugnacious", "pugnaciously", "pugnacity", "punch", "punish", "punishable", "punk", "puny", "puppets", "puzzled", "puzzlement", "puzzling", "quack", "qualm", "qualms", "quandary", "quarrel", "quarrellous", "quarrellously", "quarrelsome", "quash", "queer", "questionable", "quibble", "quibbles", "quitter", "rabid", "racist", "racists", "radical", "radicalization", "radically", "radicals", "ragged", "raging", "rail", "raked", "rampage", "ramshackle", "rancor", "rankle", "rant", "ranted", "ranting", "rantingly", "rants", "rape", "raped", "raping", "rascal", "rash", "rattle", "rattled", "rattles", "ravage", "reactionary", "rebellious", "rebuff", "rebuke", "recalcitrant", "recant", "recession", "recessionary", "reckless", "recklessly", "recklessness", "recoil", "recourses", "redundancy", "redundant", "refusal", "refuse", "refused", "refuses", "refutation", "refute", "refuted", "refutes", "refuting", "regress", "regression", "regressive", "regret", "regreted", "regretful", "regretfully", "regrets", "regrettable", "regrettably", "regretted", "rejected", "rejecting", "rejection", "rejects", "relapse", "relentless", "relentlessly", "relentlessness", "reluctance", "reluctant", "reluctantly", "remorse", "remorseful", "remorsefully", "remorseless", "remorselessly",
     "remorselessness", "renounce", "renunciation", "repel", "repetitive", "reprehensible", "reprehensibly", "reprehension", "reprehensive", "repress", "repression", "repressive", "reprimand", "reproachful", "reprove", "reprovingly", "repudiate", "repudiation", "repugn", "repugnance", "repugnantly", "repulse", "repulsed", "repulsing", "repulsive", "repulsively", "repulsiveness", "resent", "resentful", "resentment", "resignation", "resigned", "resistance", "restless", "restlessness", "restrict", "restricted", "restriction", "restrictive", "resurgent", "retaliatory", "retard", "retarded", "retardedness", "retards", "reticent", "retract", "retreat", "retreated", "revenge", "revengeful", "revengefully", "revert", "revile", "reviled", "revoke", "revolt", "revolting", "revoltingly", "revulsion", "revulsive", "rhetoric", "rhetorical", "ricer", "ridicules", "ridiculous", "rife", "rift", "rifts", "rigid", "rigidity", "rigidness", "rile", "riled", "rip", "rip-off", "ripped", "risk", "risks", "risky", "rival", "rivalry", "roadblocks", "rocky", "rogue", "rollercoaster", "rot", "rotten", "rough", "rremediable", "rubbish", "rude", "rue", "ruffian", "ruin", "ruined", "ruining", "ruinous", "ruins", "rumbling", "rumor", "rumors", "rumours", "rumple", "run-down", "runaway", "rupture", "rust", "rusty", "rut", "ruthless", "ruthlessly", "ruthlessness", "ruts", "sabotage", "sacrificed", "sad", "sadden", "sadly", "sag", "sagged", "sagging", "sags", "salacious", "sanctimonious", "sap", "sarcasm", "sarcastic", "sarcastically", "sardonic", "sardonically", "sass", "satirical", "satirize", "savage", "savaged", "savagery", "savages", "scaly", "scam", "scams", "scandal", "scandalize", "scandalized", "scandalously", "scandals", "scandel", "scandels", "scant", "scapegoat", "scarce", "scarcely", "scarcity", "scare", "scared", "scarier", "scariest", "scarily", "scars", "scary", "scathing", "scathingly", "sceptical", "scoff", "scoffingly", "scold", "scolded", "scolding", "scoldingly", "scorching", "scorchingly", "scorn", "scornful", "scornfully", "scoundrel", "scourge", "scowl", "scramble", "scrambled", "scrambles", "scrambling", "scrap", "scratch", "scratched", "scratches", "scratchy", "scream", "screech", "screwed", "screwed-up", "scuff", "scum", "second-tier", "secretive", "sedentary", "seedy", "seethe", "seething", "self-coup", "self-criticism", "self-defeating", "self-destructive", "self-humiliation", "self-interest", "self-serving", "selfinterested", "selfish", "selfishly", "selfishness", "semi-retarded", "senile", "sensationalize", "senseless", "senselessly", "sermonize", "servitude", "set-up", "setback", "setbacks", "sever", "severe", "severity", "sh*t", "shabby", "shadowy", "shady", "shake", "shaky", "shallow", "sham", "shambles", "shame", "shameful", "shamefully", "shamefulness", "shameless", "shamelessly", "shamelessness", "shark", "sharply", "shatter", "shemale", "shimmer", "shimmy", "shipwreck", "shirk", "shit", "shiver", "shock", "shocked", "shocking", "shockingly", "shoddy", "shortage", "shortchange", "shortcoming", "shortcomings", "shortness", "shortsighted", "shortsightedness", "showdown", "shrew", "shrill", "shrilly", "shrivel", "shroud", "shrouded", "shrug", "shun", "sick", "sicken", "sickening", "sickeningly", "sickly", "sickness", "sidetrack", "sidetracked", "siege", "sillily", "silly", "simplistic", "simplistically", "sin", "sinful", "sinister", "sinisterly", "sink", "sinking", "skeletons", "skeptic", "skeptical", "skepticism", "sketchy", "skimpy", "skinny", "skittish", "skittishly", "skulk", "slack", "slander", "slanderous", "slanderously", "slanders", "slashing", "slaughtered", "slave", "slaves", "sleazy", "slime", "slog", "slogging", "slogs", "sloooooooooooooow", "slooow", "sloow", "sloppily", "sloppy", "sloth", "slow", "slow-moving", "slowed", "slower", "slowest", "slowly", "sloww", "slowww", "slug", "sluggish", "slump", "slumping", "slumpping", "slur", "slut", "sluts", "sly", "smack", "smallish", "smash", "smear", "smell", "smelled", "smelling", "smells", "smelt", "smoke", "smolder", "smoldering", "smother", "smoulder", "smouldering", "smudged", "smudges", "smudging", "smug", "smugly", "smut", "smuttier", "smuttiest", "smutty", "snag", "snagged", "snagging", "snags", "snappish", "snappishly", "snare", "snarky", "snarl", "sneak", "sneakily", "sneaky", "sneer", "sneering", "sneeringly", "snob", "snobbish", "snobby", "snobish", "snobs", "snub", "so-cal", "soapy", "sob", "sober", "sobering", "solemn", "solicitude", "somber", "sore", "sorely", "soreness", "sorrow", "sorrowfully", "sorry", "sour", "sourly", "spade", "spank", "spew", "spewing", "spews", "spilling", "spinster", "spiritless", "spite", "spiteful", "spitefully", "spitefulness", "splatter", "split", "splitting", "spoil", "spoilage", "spoilages", "spoiled", "spoilled", "spoils", "spook", "spookier", "spookily", "spooky", "spoon-fed", "spoon-feed", "spoonfed", "sporadic", "spurious", "sputter", "squabble", "squabbling", "squander", "squash", "squeak", "squeaky", "squeal", "squealing", "squeals", "squirm", "stab", "stagnate", "stagnation", "staid", "stain", "stalemate", "stall", "stalls", "stammer", "stampede", "standstill", "stark", "starkly", "startle", "startling", "startlingly", "starvation", "starve", "steal", "stealing", "steals", "steep", "steeply", "stench", "stereotype", "stereotypical", "stereotypically", "stern", "stew", "stiff", "stiffness", "stifle", "stifling", "stiflingly", "stigma", "stigmatize", "sting", "stingingly", "stingy", "stink", "stinks", "stodgy", "stole", "stooge", "stooges", "stormy", "straggle", "straggler", "strain", "straining", "strange", "strangely", "strangest", "strangle", "streaky", "strenuous", "stress", "stresses", "stressful", "stressfully", "stricken", "strict", "strident", "stridently", "strife", "strike", "stringent", "stringently", "struck", "struggle", "struggled", "struggling", "strut", "stubborn", "stubbornly", "stubbornness", "stuck", "stuffy", "stumble", "stumbles", "stump", "stumped", "stumps", "stun", "stunt", "stunted", "stupid", "stupidest", "stupidity", "stupidly", "stupify", "stupor", "stutter", "stuttered", "stuttering", "stutters", "sty", "stymied", "sub-par", "subdued", "subjected", "subjection", "subjugate", "subjugation", "submissive", "subordinate", "subpoenas", "subservience", "subservient", "substandard", "subtract", "subversive", "subversively", "subvert", "succumb", "suck", "sucker", "sucks", "sucky", "sued", "sueing", "sues", "suffer", "sufferer", "suffocate", "sugarcoated", "suicidal", "suicide", "sulk", "sullen", "sully", "sunder", "sunk", "sunken", "superficiality", "superficially", "superstition", "superstitious", "suppress", "suppression", "surrender", "susceptible", "suspect", "suspicion", "suspicions", "suspicious", "suspiciously", "swagger", "swamped", "swelled", "swelling", "swindle", "swipe", "swollen", "symptom", "symptoms", "syndrome", "taboo", "tacky", "taint", "tainted", "tamper", "tangle", "tangles", "tank", "tanked", "tanks", "tantrum", "tardy", "tarnish", "tarnished", "tarnishes", "tarnishing", "tattered", "taunt", "taunting", "tauntingly", "taunts", "taut", "tawdry", "taxing", "tease", "teasingly", "tediously", "temerity", "temper", "tempest", "temptation", "tense", "tension", "tentative", "tentatively", "tenuous", "tenuously", "tepid", "terrible", "terribleness", "terribly", "terror", "terror-genic", "terrorism", "terrorize", "testily", "testy", "tetchily", "tetchy", "thankless", "thicker", "thirst", "thorny", "thoughtless", "thoughtlessly", "thoughtlessness", "thrash", "threat", "threaten", "threatening", "threats", "threesome", "throb", "throbbed", "throbbing", "throbs", "throttle", "thug", "thumbs-down", "thwart", "time-consuming", "timid", "timidity", "timidly", "timidness", "tin-y", "tingling", "tired", "tiresome", "tiring", "tiringly", "toil", "toll", "topple", "torment", "tormented", "torrent", "tortuous", "torture", "tortured", "tortures", "torturing", "torturous", "torturously", "touchy", "tout", "touted", "touts", "toxic", "traduce", "tragedy", "tragic", "tragically", "traitor", "traitorous", "tramp", "trample", "transgress", "transgression", "trap", "traped", "trapped", "trash", "trashed", "trashy", "trauma", "traumatic", "traumatized", "travesties", "travesty", "treacherously", "treachery", "treason", "trick", "tricked", "trickery", "tricky", "trivial", "trivialize", "trouble", "troubled", "troublemaker", "troubles", "troublesome", "troublesomely", "troubling", "troublingly", "truant", "tumble", "tumbled", "tumbles", "tumultuous", "turbulent", "turmoil", "twist", "twisted", "twists", "two-faced", "two-faces", "tyrannical", "tyrannically", "tyrant", "ugh", "uglier", "ugliest", "ugliness", "ugly", "ulterior", "ultimatums", "ultra-hardline", "unable", "unacceptable", "unacceptablely", "unaccessible", "unaccustomed", "unachievable", "unappealing", "unauthentic", "unavailable", "unavoidably", "unbearable", "unbearablely", "unbelievable", "unbelievably", "uncaring", "uncertain", "uncivil", "uncivilized", "unclean", "unclear", "uncollectible", "uncomfortable", "uncomfortably", "uncompetitive", "uncompromising", "uncompromisingly", "unconstitutional", "uncontrolled", "unconvincing", "unconvincingly", "uncooperative", "uncouth", "uncreative", "undecided", "undefined", "undependability", "undependable", "undercuts", "undercutting", "underdog", "underestimate", "underlings", "undermine", "undermined", "undermines", "undermining", "underpaid", "underpowered", "undersized", "undesirable", "undetermined", "undid", "undignified", "undissolved", "undocumented", "undone", "undue", "unease", "uneasily", "uneasy", "uneconomical", "unemployed", "unequal", "uneven", "uneventful", "unexpectedly", "unexplained", "unfairly", "unfaithful", "unfaithfully", "unfamiliar", "unfavorable", "unfeeling", "unfinished", "unfit", "unforeseen", "unforgiving", "unfortunate", "unfortunately", "unfounded", "unfriendly", "unfulfilled", "unfunded", "ungovernable", "ungrateful", "unhappily", "unhappiness", "unhappy", "unhelpful", "unilateralism", "unimaginable", "unimaginably", "unimportant", "uninformed", "uninsured", "unintelligible", "unintelligile", "unipolar", "unjust", "unjustifiable", "unjustifiably", "unjustified", "unjustly", "unkind", "unkindly", "unknown", "unlamentable", "unlamentably", "unlawful", "unlawfulness", "unleash", "unlicensed", "unlikely", "unlucky", "unmoved", "unnatural", "unnaturally", "unnecessary", "unneeded", "unnerve", "unnerved", "unnerving", "unnervingly", "unnoticed", "unorthodox", "unorthodoxy", "unpleasant", "unpleasantries", "unpredictable", "unprepared", "unproductive", "unprofitable", "unprove", "unproved", "unproven", "unproves", "unproving", "unqualified", "unravel", "unraveled", "unreachable", "unreadable", "unrealistic", "unreasonable", "unreasonably", "unrelenting", "unrelentingly", "unreliability", "unresolved", "unresponsive", "unrest", "unruly", "unsafe", "unsatisfactory", "unsavory", "unscrupulous", "unscrupulously", "unsecure", "unseemly", "unsettle", "unsettled", "unsettling", "unsettlingly", "unskilled", "unsophisticated", "unsound", "unspeakable", "unspeakablely", "unspecified", "unsteadily", "unsteadiness", "unsteady", "unsuccessful", "unsuccessfully", "unsupported", "unsupportive", "unsure", "unsuspecting", "unsustainable", "untenable", "unthinkable", "unthinkably", "untimely", "untouched", "untrue", "untrustworthy", "untruthful", "unusable", "unusably", "unuseable", "unuseably", "unusual", "unusually", "unviewable", "unwanted", "unwarranted", "unwatchable", "unwelcome", "unwell", "unwieldy", "unwilling", "unwillingly", "unwillingness", "unwise", "unwisely", "unworkable", "unworthy", "unyielding", "uprising", "uproar", "uproarious", "uproariously", "uproarous", "uproarously", "uproot", "upseting", "upsets", "upsettingly", "urgent", "useless", "usurp", "usurper", "utterly", "vagrant", "vague", "vagueness", "vainly", "vehement", "vehemently", "vengeance", "vengefully", "vengefulness", "venom", "venomous", "venomously", "vent", "vestiges", "vex", "vexation", "vexing", "vibrates", "vibrating", "vibration", "vice", "vicious", "viciously", "viciousness", "victimize", "vile", "vileness", "villainous", "villainously", "villains", "villian", "villianous", "villianously", "villify", "vindictively", "vindictiveness", "violate", "violation", "violators", "violent", "violently", "viper", "virulence", "virulent", "virulently", "virus", "vociferous", "vociferously", "volatile", "volatility", "vomit", "vomited", "vomiting", "vulgar", "wack", "wail", "wallow", "wane", "waning", "war-like", "warily", "wariness", "warp", "warped", "washed-out", "waste", "wasted", "wasteful", "wastefulness", "wasting", "water-down", "watered-down", "wayward", "weaken", "weaker", "weakness", "weaknesses", "weariness", "wearisome", "weary", "wedge", "weed", "weep", "weird", "weirdly", "wheedle", "whine", "whining", "whiny", "whips", "whore", "whores", "wicked", "wickedly", "wickedness", "wild", "wiles", "wilt", "wily", "wimpy", "wince", "wobble", "wobbles", "woe", "woebegone", "woeful", "woefully", "womanizing", "worn", "worried", "worrier", "worries", "worrisome", "worry", "worryingly", "worse", "worsen", "worsening", "worthless", "worthlessly", "worthlessness", "wound", "wounds", "wrangle", "wrath", "wreak", "wreaked", "wreaks", "wreck", "wrest", "wrestle", "wretch", "wretched", "wretchedly", "wretchedness", "wrinkle", "wrinkled", "wrinkles", "wrip", "wripping", "writhe", "wrong", "wrongful", "wrongly", "wrought", "yawn", "zap", "zaps", "zealot", "zealous"]

  function containsNegative(toCheck) {
    console.log("Ran neg");
    for(var i = 0; i < negativeWords.length; i++) {
      if(toCheck.indexOf(negativeWords[i]) !== -1) return true;
    }
    return false;
  }

  var message = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    yesButton.innerText = "Okay";
    yesButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      pendingMessage = false;
      callback();
      display();
    }
  };
  var getChoice = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    yesButton.innerText = "Yes";
    yesButton.classList.remove("hidden");
    noButton.innerText = "No";
    noButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(true);
      display();
    };
    noButton.onclick = function() {
      messageElement.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(false);
      display();
    };
  };
  var getInput = function(binding, msg, callback) {
    pendingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    inputBox.value = "";
    inputBox.classList.remove("hidden");
    yesButton.innerText = "Enter";
    yesButton.classList.remove("hidden");
    noButton.innerText = "No Input";
    noButton.classList.remove("hidden");
    yesButton.onclick = function() {
      messageElement.classList.add("hidden");
      inputBox.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(inputBox.value);
      display();
    };
    noButton.onclick = function() {
      messageElement.classList.add("hidden");
      inputBox.classList.add("hidden");
      yesButton.classList.add("hidden");
      noButton.classList.add("hidden");
      pendingMessage = false;
      callback(null);
      display();
    };
  };

  var Combat = {
    log: function(entry, className) {
      var line = document.createElement("p");
      line.innerText = entry;
      if(className) {
        line.className = className;
      }
      combatLog.appendChild(line);

      combatLog.scrollTop = line.offsetTop;
    }
  };

  var Dice = {
    d20: function(number) {
      return 1 + Math.floor(Math.random() * 20);
    },
    d6: function(number) {
      return 1 + Math.floor(Math.random() * 6);
    },
    dx: function(number, sides) {
      var sum = 0;
      for(var i = 0; i < number; i++) {
        sum += 1 + Math.floor(Math.random() * sides);
      }
      return sum;
    }
  };

  var combatLog = document.getElementById("combat-log");

  var hpDisplay = document.getElementById("hp-display");

  var table = document.getElementById("map-table");

  var inventoryList = document.getElementById("inventory-list");

  var events = getEvents();

  var player;

  var playerName;
  var map;
  getInput(this, "Please enter your player's name.", function(input) {
    playerName = input;
    if(playerName === null || playerName.trim() === "") {
      playerName = "Player";
    }
    player = new Player(playerName, playerBaseHp, playerBaseAc);
    map = generateMap();
    display();
    getChoice(this, "Would you like to play in death wish mode? (Recommended for experienced players)"
    , function(hardmode) {
      if(hardmode) {
        var dmg = Dice.dx(5, 6);
        player.takeDamage(dmg, "lightning");
        player.ac = -20;
        player.attack = -5;
        player.damageRoll = function() { return 1; };
        player.damage = "1 non-rolled";
        player.name = "Someone who underestimated hardmode";
        message(this, "Lighning instantly strikes you. You develop a severe headache and arthritis. You feel greatly fatigued. One of your arms falls off.");
      }
    });
  });




  var namePrefixes = ["Dark", "Murky", "Shadow", "Dubious", "Final", "Demon", "シ", "Health", "Sled", "Scared", "Scarred", "Death", "Blueface"];
  var settings = ["You find a potion in the center of a ruined stone amphitheater. ",
    "You discover a potion in a small alcove carved into a tree. ",
    "You see a potion lying in the middle of a field. ",
    "You find a potion atop a stone pedestal on the summit of a mountain. ",
    "You find a potion in a cave. You painstakingly crawl through the cave to reach the potion. ",
    "You find a potion in a birds nest on the ground. "
  ];
  var potionLooks = ["The potion is in an opaque wooden jug with a straw sticking out the top. ",
    "The potion is in a clear, pristine crystal vial. The contained liquid is mud-colored. ",
    "The potion is in an opaque triangular prism shaped bottle. ",
    "The potion is shaped like a sword with the tip of the blade serving as a straw. ",
    "The potion is in a glass. It is a jet black liquid that is bubbling wildly. ",
    "The potion is inside a balloon. ",
    "The potion is inside a leather waterskin. You cannot tell what color the potion is, but it appears to be bubbling wildly judging by the changing shape of the waterskin. ",
    "The potion is inside a clear, cut-gem-shaped crystal with a circular opening at the top. The potion is clear, but has letters suspended in it. These letters are \"E\", \"D\", and \"A.\" ",
    "The potion is inside a plastic bag. You will have to use your own vessel to drink it. The potion is bloodred and nearly frozen. "
  ];
  var omens = ["As you approach the potion, an owl flies above you.",
    "As you approach the potion, nothing happens.",
    "You trip as you approach the potion, and you take a large amount of happiness damage.",
    "Your name changes as you approach the potion.",
    "You hear whispers telling you to drink the potion as you approach it.",
    "You footsteps behind you, but there is nothing there. When you look back at the potion, nothing happens.",
    "The sun disappears from the sky as you approach the potion for about 5 seconds before returning.",
    "You hear whispers telling you not to drink the potion as you approach.",
    "The moon disappears from the sky as you approach the potion for about 50 seconds before returning.",
    "As you approach the potion, a raven flies above you."
  ];
  var effects = [
      function(speed, magnitude, internalNums, callback) {
        player.hp += Math.round(magnitude * speed * 10);
        message(this, "You feel reinvigorated", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.takeDamage(Math.round(magnitude * speed * 3), "Potion", "You died after drinking a highly suspicous liquid.");
        message(this, "Whatever it was that you drank, it drains you.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.ac += (magnitude * internalNums[0]) / (speed * internalNums[1]);
        player.ac = Math.ceil(player.ac);
        message(this, "You feel time seem to slow down.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        player.damage += Math.round((speed * magnitude * internalNums[0]) / internalNums[1]);
        message(this, "You feel somewhat stronger.", callback);
      },
      function(speed, magnitude, internalNums, callback) {
        var type = internalNums[0];
        if(type < 4) {
          player.damage = Math.round(magnitude * speed * internalNums[1]);
          player.attack += Math.round(magnitude * internalNums[2]);
          message(this, "After you drink the potion, you notice your hand has morphed into a sort of scythe. The scythe seems to be razor-sharp, are will likely be useful."
          , callback);
        } else {
          player.ac += Math.ceil((magnitude * internalNums[3] + speed) / 2);
          message(this, "Your skin seems to have hardened, its texture now resembles that of an insect's exoskeleton."
          , callback);
        }
      },
      function(speed, magnitude, internalNums, callback) {
        if(speed % internalNums[0] === 0) {
          player.ac += Math.round(magnitude * speed * 3);
        }
        if(speed % internalNums[1] === 0) {
          player.ac *= (magnitude * speed / 7) + 1;
          player.ac = Math.ceil(player.ac);
        }
        if(speed % internalNums[2] === 0) {
          player.attack += Math.round(magnitude * internalNums[6]);
        }
        if(speed % internalNums[3] === 0) {
          player.damage = Math.round(magnitude * internalNums[7]);
        }
        if(speed % internalNums[4] === 0) {
          player.ac += magnitude * internalNums[8];
        }
        if(speed % internalNums[5] === 0) {
          player.attackRoll = function() {
            return Math.round(Dice.d20() * 2.5);
          }
        }
        if(speed == 10) {
          player.attackRoll = function() {
            return -Infinity;
          }
        }
        message(this, "Whatever you just drank appears to have left you unconcious for a few hours. You feel like something has happened, but you aren't quite sure what."
        , callback)
      }
  ];
  var effectsText = [
    "you will be healed.",
    "you will be hurt.",
    "your clock will break.",
    "you will be stronger.",
    "you will become something else.",
    "something nobody can predict will happen to you."
  ];
  var magnitudeMap = {};
  for(var i = 0; i < settings.length; i++) {
    magnitudeMap[settings[i]] = Math.random();
  }
  var effectMap = {};
  var effectDisplayedMap = {};
  for(var i = 0; i < potionLooks.length; i++) {
    var effectChoice = Math.floor(Math.random() * effects.length);
    effectMap[potionLooks[i]] = effects[effectChoice];
    effectDisplayedMap[potionLooks[i]] = effectsText[effectChoice];
  }
  var internalMap = {};
  for(var i = 0; i < omens.length; i++) {
    internalMap[omens[i]] = [];
    for(var j = 0; j < 15; j++) {
      internalMap[omens[i]].push(Math.ceil(Math.random() * 10));
    }
  }



  function round(presetMove) {
    if(gameOver || pendingMessage) return;
    var move;
    if(presetMove) {
      move = presetMove;
    } else {
      console.log("Round was called without a move.");
    }

    var destMap = {
      "n": { x: player.x, y: player.y - 1 },
      "s": { x: player.x, y: player.y + 1 },
      "e": { x: player.x + 1, y: player.y },
      "w": { x: player.x - 1, y: player.y }
    }
    var dest = destMap[move];
    if((dest.x < 0) || (dest.y < 0) || (dest.x > mapWidth - 1) || (dest.y > mapHeight - 1)) {
      if(!presetMove) round();
      return;
    }

    var destTile = map[dest.x][dest.y];
    if(!destTile.passable) {
      destTile.explored = true;
      if(!wallDone) {
        wallDone = true;
        message(this, "Upon entering the area, you see a small wall. Beyond the wall is a large, empty area. The wall is only 4 feet, something you could easily scale, but you somehow feel that you cannot cross it."
        , function() {
          getChoice(this, "Would you like to try crossing the small wall?", function(crossWall) {
            if(crossWall) {
              message(this, "Upon closer examination, you find that the wall has a very odd texture. Even above the wall, this same texture persists. It feels almost like an enourmous amount of large shields were connected together. For some reason however, you cannot seem to see them nor anything behind them."
              , function() {
                getInput(this, "If you could choose one word to describe the behavior of these tower shields, what would it be?", function(quiz) {
                  var wrongMessage = "Why would a word you think of be important? You return to where you were before you visited the wall.";
                  if(quiz === null) quiz = "";
                  quiz = quiz.trim().toLowerCase();
                  var wasNegative = containsNegative(quiz);
                  if(quiz === "broken") {
                    message(this, "When the word broken comes to your mind, you glance at your hand and notice it is invisible."
                    , function() {
                      player.ac += 12;
                      Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                      display();
                    });
                  } else if(wasNegative) {
                    message(this, "You feel a shudder coming from the shields in response to your criticism. The shields begin to fall on you."
                    , function() {
                      player.takeDamage(40, "Many shields");
                      Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and insulted the shields.");
                      display();
                    });
                  } else {
                    message(this, wrongMessage, function() {
                      Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                      display();
                    });
                  }
                });
              });
            } else {
              player.ac = 4;
              message(this, "Your lack of curiosity makes you more susceptible to your enemies. You might have been able to dodge before, but now you are simply a slug."
              , function() {
                var slugImg = document.createElement("img");
                slugImg.src = "https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/slug_0.jpg";
                slugImg.alt = "slug";
                slugImg.width = 250;
                slugImg.height = 125;
                var desc = document.createElement("p");
                desc.innerText = "You became a ";
                combatLog.appendChild(desc);
                combatLog.appendChild(slugImg);
                Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
                display();
              });
            }
          });
        });
      } else {
        message(this, "You run into a stone wall extending into the sky as far as you can see. You turn back."
        , function() {
          Combat.log(player.name + " runs into a wall at (" + dest.x + ", " + dest.y + ") and has to turn back.");
          display();
        });
      }
      return;
    }
    var successfulMove = function() {
      player.x = dest.x;
      player.y = dest.y;
      destTile.explored = true;
      Combat.log(player.name + " successfully moves to (" + player.x + ", " + player.y + ") with " + player.hp + " HP.");
      display();
    };
    if(destTile.event) {
      if(!destTile.event.done) {
        getChoice(this, "You have a feeling the area ahead might contain something interesting. Would you like to proceed?", function(proceed) {
          if(!proceed) return;
          destTile.event.run(function() {
            if(gameOver) {
              destTile.explored = true;
              display();
              return;
            }
            if(!destTile.event.done) {
              destTile.explored = true;
              Combat.log(player.name + " leaves (" + dest.x + ", " + dest.y + ") and returns to their previous location.");
              display();
              return;
            }
            successfulMove();
          });
        });
      } else {
        successfulMove();
      }
    } else {
      successfulMove();
    }
  }

  document.onkeydown = function(e) {
    if(e.keyCode === 32) {
      round();
    } else if(e.keyCode === 38 || e.keyCode === 87) {
      if(e.keyCode !== 87) e.preventDefault();
      round("n");
    } else if(e.keyCode === 37 || e.keyCode === 65) {
      if(e.keyCode !== 65) e.preventDefault();
      round("w");
    } else if(e.keyCode === 40 || e.keyCode === 83) {
      if(e.keyCode !== 83) e.preventDefault();
      round("s");
    } else if(e.keyCode === 39 || e.keyCode === 68) {
      if(e.keyCode !== 68) e.preventDefault();
      round("e");
    }
  }


  function getEvents() {
    var events = [];

    var muramasa = new Event("Muramasa",
      "You find an old wooden chest rotting away. Inside, you find a pristine katana made of a dark colored metal with an inscription written in a language unknown to you.");
    muramasa.run = function(callback) {
      message(this, muramasa.text, function() {
        getChoice(this, "Would you like to wield the katana?"
        , function(wieldMuramasa) {
          if(wieldMuramasa) {
            player.damage += 4;
            player.attack += 6;
            player.inventory.push("Muramasa");
            message(this, "The katana's balance feels perfect. You are certain you will be able to take on tougher enemies with this."
            , function() {
              this.done = true;
              Combat.log(player.name + " obtains Muramasa.");
              getChoice(this, "Would you like to test the sharpness with your finger?"
              , function(testSharpness) {
                if(testSharpness) {
                  display();
                  player.takeDamage(2, "Muramasa", "You died by touching a katana with your finger.");
                  message(this, "The katana is sharp enough that you cut deeper than planned, reaching the bone of your finger.", callback);
                  return;
                }
                display();
                callback();
              });
            });
          } else {
            message(this, "Reluctantly, you leave what could have made an excellent weapon in the chest.", callback);
          }
        });
      });
    };
    events.push(muramasa);

    var potionBook = new Event("Potion Book",
      "You find a book titled: \"Ultimate Guide to Potions\"");
    potionBook.run = function(callback) {
      message(this, potionBook.text, function() {
        var potionBookText = "Ultimate Guide to Potions";
        potionBookText += "<p>All potions have an effect, a power level, and an effect matrix. These three combine with the drink speed to produce an effect. Drinking a potion at speed 10 is highly risky if the effect is unknown. The first numbers of the effect matrix are the ones used most often. Most effect matrices are used to determine either the variation of strength of the effect. Nothing outside of drink speed, magnitude, and the effect matrix is used in determining the effect. More general effects depend on more numbers from their effect matrices.</p>";
        potionBookText += "<h4>Effect Types:</h4>";
        for(var text in effectMap) {
          potionBookText += "<strong>\"" + text + "\"</strong> means <strong>" + effectDisplayedMap[text] + "</strong><br />";
        }
        potionBookText += "<h4>Effect Power:</h4>";
        for(var text in magnitudeMap) {
          potionBookText += "<strong>\"" + text + "\"</strong> means <strong>" + (Math.round(magnitudeMap[text] * 10) / 10) + "</strong> is the overall strength of the potion.<br />";
        }
        potionBookText += "<h4>Effect Matrix:</h4>";
        for(var text in internalMap) {
          var internalNumsAssoc = internalMap[text];
          var effectMatrix = " ";
          for(var i = 0; i < internalNumsAssoc.length; i++) {
            effectMatrix += internalNumsAssoc[i] + " ";
          }
          potionBookText += "<strong>\"" + text + "\"</strong> has an associated matrix of (" + effectMatrix + ")<br />";
        }
        player.inventory.push(potionBookText);
        this.done = true;
        callback();
      });
    };
    var potionBookHouse = new Event("Cave",
      "You find a cave entrance with a door built into a cliff overlooking a lake. There is a path leading up the side of the cliff towards the cave.");
    potionBookHouse.run = function(callback) {
      message(this, this.text, function() {
        getChoice(this, "Would you like to enter the cave through the door?"
        , function(enterCave) {
          if(enterCave) {
            message(this, "When you enter the door, you see an octopus. Each of the octopus' tentacles is holding an open book. The octopus seems to be reading multiple books at the same time. It gestures for you to take a book lying on a table between you and the octopus."
            , function() {
              getChoice(this, "Would you like to take the book?"
              , function(takeBook) {
                if(takeBook) {
                  potionBook.run(callback);
                  this.done = true;
                } else {
                  getChoice(this, "Would you like to attack the octopus?"
                  , function(attackOctopus) {
                    if(attackOctopus) {
                      message(this, "The octopus parries your strike with one of its tentacles while casting a spell with its other tentacle. When it finishes casting, you can no longer breathe.");
                      player.takeDamage(Infinity, "Asphyxiation", "You died after attempting to attack a peaceful but deadly octopus.");
                      display();
                      return;
                    } else {
                      message(this, "As you leave the cave, the octopus seems disappointed.", callback);
                      return;
                    }
                  });
                }
              });
            });
          } else {
            message(this, "You leave and return to where you were, wondering what could have been in the cave.", callback);
            return;
          }
        });
      });
    };
    events.push(potionBookHouse);


    var doll = new Event("Doll",
      "In a clearing in the middle of a forest, you see a doll about 14 inches tall standing outside a staircase leading into the ground. It is wearing a black and white mask and is dressed in a tuxedo. It begins to approach you slowly.");
    doll.run = function(callback) {
      message(this, doll.text, function() {
        var doDungeon = function() {
          getChoice(this, "Do you want to enter the dungeon under the staircase?"
          , function(enterDungeon) {
            if(enterDungeon) {
                message(this, "The staircase leads to an underground hallway made of smoothly carved stone. The entire area is well lit by torches as if it were populated. At the end of the hall, you find a man dressed in the same way as the dolls, wearing a similar mask. He says that he is disappointed that a single adventurer will be the one to complete his story. He crumbles into dust, leaving only his mask."
                , function() {
                  getChoice(this, "Would you like to equip the mask left on the ground."
                  , function(equipMask) {
                    if(equipMask) {
                      message(this, "Upon equipping the mask, you feel your mind being invaded by the demon that left the mask. You are unsure if you will regain control."
                      , function() {
                        if(Math.random() > 0.7) {
                          player.inventory.push("Mask of Vanir");
                          player.ac += 12;
                          player.hp += 60;
                          Combat.log(player.name + " defeats demon and gains Mask of Vanir.");
                          message(this, "You manage to wrestle control from the demon. Your soul is now also fused the mask, making you immune to damage anywhere else."
                          , callback);
                        } else {
                          player.takeDamage(Infinity, "not having a soul", "Your soul was absorbed by a demon.");
                          Combat.log(player.name + " has soul eaten by a demon.");
                          display();
                          message(this, "Your conciousness slowly fades as the demon absorbs your soul.", callback);
                          return;
                        }
                      });
                    } else {
                      message(this, "You leave the mask where it is in the dungeon and leave.", callback);
                    }
                  });
                });
            } else {
              message(this, "You leave emptyhanded.", callback);
            }
          });
          this.done = true;
        }

        getChoice(this, "Would you like to attack the doll?"
        , function(attackDoll) {
          if(attackDoll) {
            message(this, "The doll explodes upon being hit but is far enough that is does not hurt you. After it explodes, about 50 more dolls march up the staircase in the ground one by one. You manage to destroy all of them without being injured."
            , doDungeon);
          } else {
            message(this, "The doll approaches you and grabs your leg. You find it rather cute, until the doll suddenly explodes."
            , function() {
              player.takeDamage(4, "a doll", "You died by letting a suspicious doll explode on you.");
              if(player.hp <= 0) {
                message(this, "The doll's explosion killed you.", callback);
                display();
                return;
              } else {
                message(this, "After the doll explodes, you destroy another 50 that appear, without taking damage."
                , doDungeon);
              }
            });
          }
        });
      });
    };
    events.push(doll);

    var bridgeMan = new Event("Orc Bridge",
      "You enter a city filled with orcs. A large bridge with fewer orcs on it leads through the city. You take this bridge partway through the city. You are careful to maintain your position close the the center since a fall would be lethal.");
    bridgeMan.run = function(callback) {
      message(this, bridgeMan.text + " Partway along the bridge, you see what appears to be an orc captain weighing over 800 pounds. You hear him yell, \"Start the trolley!\"  Over the edge of the bridge, you see a small train on a path to collide with a group of 20 human slaves. The orc captain is positioned right on the edge of the bridge over the train tracks between the train and the slaves."
      , function() {
        getChoice(this, "Would you like to push the orc captain over the edge of the bridge?"
        , function(pushOrc) {
          if(pushOrc) {
            Combat.log(player.name + " saves slaves by pushing an orc captain off a bridge.");
            message(this, "The orc captain stops the trolley and dies in the process.", callback);
          } else {
            Combat.log(player.name + " cold-bloodedly condemns slaves to death by being run over by a train.");
            message(this, "The train hits the slaves, and the orc captain appears to be overjoyed at the gruesome sight that has unfolded below.", callback);
          }
          this.done = true;
        });
      });
    };
    events.push(bridgeMan);

    var cobraReward = function(callback) {
      message(this, "Inside the cabin, you find a vial filled with a murky liquid labeled \"health serum.\""
      , function() {
        getChoice(this, "Would you like to drink the liquid?"
        , function(drinkLiquid) {
          if(drinkLiquid) {
            player.hp += 150;
            Combat.log(player.name + " drinks health serum.");
            message(this, "You feel reinvigorated.", callback);
          } else {
            message(this, "Drinking a strange liquid is probably not a good idea, so you leave without drinking it.", callback);
          }
        });
      });
    };
    var cobra = new CombatEvent("Iron Cobra",
      "You encounter an Iron Cobra outside a small log cabin. It is a 7 foot long cobra made entirely of iron except for an enchanted core created by an artifacer. They usually are created to guard valuables.",
      [(new Character("Iron Cobra", 27, 16, 7, 2))],
      cobraReward
    );
    events.push(cobra);

    var squirrelReward = function(callback) {
      Combat.log(player.name + " acquires squirrel.");
      player.inventory.push("Squirrel corpse");
      message(this, "You take the squirrel's corpse with you as a \"prize.\"", callback);
    };
    var squirrel = new CombatEvent("Squirrel",
      "You encounter a man who is drinking beer and eating peanuts. He suddenly touches a tree then turns into a large squirrel that charges at you.",
      [(new Character("Squirrel", 6, 12, 2, 1))],
      squirrelReward
    );
    events.push(squirrel);

    var rabbitReward = function(callback) {
      Combat.log(player.name + " acquires rabbit.");
      player.inventory.push("Rabbit's Fur");
      player.attack += 12;
      message(this, "You take the rabbit's fur with you as a \"prize.\" It will likely make you much luckier.", callback)
    };
    var rabbit = new CombatEvent("Rabbit",
      "You encounter a rabbit. It looks to be about 25 kilograms and has painful-looking fangs.",
      [(new Character("Killer Rabbit", 14, 7, 2, 5 + Math.floor(Math.random() * 40)))],
      rabbitReward
    );
    events.push(rabbit);

    var knightReward = function(callback) {
      getChoice(this, "Would you like to take the knight's prized armor?"
      , function(takeArmor) {
        if(takeArmor) {
          player.inventory.push("Adamantium full-plate");
          player.ac += 9;
          player.attack -= 1;
          Combat.log(player.name + " equips adamantium full-plate.");
          message(this, "Now you should be much harder to damage, but the full-plate does slightly limit your movement.", callback);
        } else {
          message(this, "Why would you pass up some good armor? In any case, you leave with nothing.", callback);
        }
      });
    };
    var knight = new CombatEvent("Knight",
      "You encounter a knight who proclaims that he is invincible due to his adamantium armor. He draws his sword and attacks.",
      [(new Character("Knight", 20, 19, 6, 3))],
      knightReward
    );
    events.push(knight);

    var infectedReward = function(callback) {
      getChoice(this, "Would you like to enter the tower?"
      , function(enterTower) {
        if(enterTower) {
          getChoice(this, "Inside the tower, you find a small table. Atop it are a mastercrafted crossbow and mask. Would you like to equip them?"
          , function(equipGear) {
            if(equipGear) {
              player.inventory.push("Mastercrafted crossbow");
              player.inventory.push("Optical mask");
              player.ac += 1;
              player.attack += 4;
              message(this, "It seems this mask has a lense built into allowing you to magnify your view. This and the crossbow should be useful.", callback);
              Combat.log(player.name + " equips optical mask and crossbow.");
            } else {
              message(this, "You leave sadly.", callback);
            }
          });
        } else {
          message(this, "You leave wondering what you could have found inside the tower.", callback);
        }
      });
    };
    var infected = new CombatEvent("Infected",
      "In the middle of a ruined city, you find a tower surrounded by people. They seem to be infected with some sort of disease affecting their skin, and they all begin running toward you when they spot you.",
      [
        (new Character("Weeper", 13, 9, 3, 0)),
        (new Character("Weeper", 9, 9, 3, 0)),
        (new Character("Weeper", 10, 9, 3, 0)),
        (new Character("Weeper", 8, 9, 3, 0)),
      ],
      infectedReward
    );
    events.push(infected);

    var bossReward = function() {
      message(this, "You have defeated Oboro. You have finally won the game.");
      if(player.hp === Infinity || player.ac === Infinity || player.attack === Infinity || player.damage === Infinity) message(this, "You victory is not satisfying, as you cheated to attain this victory.");
      var winMessage = document.createElement("h2");
      winMessage.style.color = "#00ff00";
      winMessage.innerText = "You defeated Oboro, the Messenger of the Heavens.";
      Combat.log(player.name + " defeats Oboro.");
      gameOver = true;
      return;
    };
    var bonus = Math.random() < 0.15 ? 20 : 0;
    var deadly = Math.random() < 0.02;
    var boss = new CombatEvent("Oboro",
      "You come across what was once a wide open field, when you visited it before. Now, it is strewn with countless corpses. Each of the corpses has the same cut, going from the bottom left of their torsos to the top right, about 3 inches deep. Standing at the center of this field is one man, holding a sword in his right hand. He runs towards you and begins to attack.",
      [
        (new Character("Oboro \"Messenger of the Heavens\"", 200 + Math.floor(Math.random() * 50), 25 + Math.floor(Math.random() * 5), 23 + bonus, 9 + bonus))
      ],
      bossReward
    );
    if(deadly) {
      boss = new CombatEvent("Ascendant Oboro",
        "You see a man standing in the center of a 500 meter radius marble circle. His skin seems to be made of a bloodred fire. He is holding a vorpal sword.",
        [
          (new Character("Ascendant Oboro", 200 + Dice.dx(1000, 12), 25 + Math.floor(Math.random() * 120), 87, 100))
        ],
        function() {
          message(this, "You have defeated Ascendant Oboro, the final and most powerful form of Oboro.");
          if(player.hp === Infinity || player.ac === Infinity || player.attack === Infinity || player.damage === Infinity) message(this, "You victory is not satisfying, as you cheated to attain this victory.");
          var winMessage = document.createElement("h2");
          winMessage.style.color = "#00ff00";
          winMessage.innerText = "You defeated Oboro, the Messenger of the Heavens.";
          Combat.log(player.name + " defeats Oboro.");
          gameOver = true;
          return;
        }
      );
    }
    events.push(boss);

    combatEvents = getRandomCombatEvents(7, 10);
    for(var i = 0; i < combatEvents.length; i++) {
      events.push(combatEvents[i]);
    }
    window.events = events;
    return events;
  }

  function getRandomCombatEvents(level, number) {
    var combatEvents = [];
    var monsters = [
      new Character("6-Headed Hydra", Dice.dx(6, 10) + 33, 18, 8, Math.floor(Math.random() * 8), 12),
      new Character("Mimic", Dice.dx(3, 12) + 5, 15, 5, 2, 5),
      new Character("Ancient Wyrm Black Dragon", Dice.dx(37, 12) + 296, 42, 46, 40, 30),
      new Character("Zombie Berserker", Dice.dx(5, 12) + 15, 17, 9, 4, 7),
      new Character("Skeleton", Dice.dx(2, 6), 15, 2, 2, 1),
      new Character("Hyena", Dice.dx(2, 8) + 4, 16, 3, 4, 1),
      new Character("Hippogriff", Dice.dx(3, 10) + 9, 15, 6, 4, 5),
      new Character("Rakshasa", Dice.dx(7, 8) + 21, 21, 9, 5, 11),
      new Character("Crazed and Deadly Student", 1, 0, 0, 100000, 1),
      new Character("NE Aggresive Warforged", 32, 23, 4, 10, 3),
      new Character("Crossbow-wielding Ace", 24, 17, 20, 4, 5)
    ];
    if(Math.random() < 0.04) {
      monsters.push(new Character("Legendary Goblin Hero of Vengeance", Dice.dx(20, 20), 85, 49, 50, 120));
    }
    for(var i = 0; i < Math.ceil(Math.random() * 11); i++) {
      monsters.push(new Character("Goblin", Dice.dx(1, 4), 10, 2, 0, 1));
    }
    for(var i = 0; i < Math.ceil(Math.random() * 11); i++) {
      monsters.push(new Character("Slime", Dice.dx(1, 4), 6, 2, 0, 1));
    }

    var rewards = [
      function(callback) {
        message(this, "After you kill the last monster, you discover a small pebble.");
        player.inventory.push("Mysterious Pebble");
        callback();
      },
      function(callback) {
        message(this, "You find a wooden amulet with a snake pattern carved into it. It makes you feel safer.");
        player.inventory.push("Wooden Snake Amulet");
        player.ac += 2;
        callback();
      },
      function(callback) {
        player.inventory.push("Strip of Yuan-Ti Tail Meat");
        message(this, "You find a strip of Yuan-Ti tail meat that belonged to your enemies."
        , function() {
          getChoice(this, "Would you like to take a bite?"
          , function(takeBite) {
            if(takeBite) {
              player.hp += Math.ceil(Math.random() * 5);
              message(this, "The tail meat greatly refreshes you.")
            }
            callback();
          });
        });
      },
      function(callback) {
        message(this, "You discover a map of the world.");
        player.inventory.push("Map of the World");
        for(var i = 0; i < map.length; i++) {
          for(var j = 0; j < map[i].length; j++) {
            map[i][j].explored = true;
          }
        }
        display();
        callback();
      },
      function(callback) {
        getChoice(this, "You see a lever in front of you. There is a note next to it that says it will display the real rules binding this world. Would you like to pull it?"
        , function(pullLever) {
          if(pullLever) {
            player.inventory.push("<strong>True Rulebook</strong><br /><code>"
            + round
            + "</code><br /><code>"
            + JSON.stringify(player)
            + "</code><br /><code>"
            + effects
            + "</code>");
            message(this, "You have discovered the True Rulebook.", function() {
              callback();
            });
          } else {
            callback();
          }
        });
      }
    ];

    var gemReward = function(callback) {
      var gemTypes = [ "Ruby", "Sapphire", "Diamond", "Topaz", "Opal", "Emerald", "Cryolite", "Azurite", "Slice of Cheese", "Chaos Emerald", "Rose Quartz" ];
      message(this, "You discover a chest filled with a gem. You take the gem with you.");
      player.inventory.push(gemTypes[Math.floor(Math.random() * gemTypes.length)]);
      callback();
    }
    for(var i = 0; i < Math.floor(Math.random() * 11); i++) {
        rewards.push(gemReward);
    }

    var eventsToMake = number;
    while(eventsToMake > 0) {
      eventsToMake--;
      var rewardIndex = Math.floor(Math.random() * rewards.length);
      var reward = rewards.splice(rewardIndex, 1)[0];

      var eventMonsters = [];
      var desiredCR = level;
      eventMonsters.push(monsters.splice(Math.floor(Math.random() * monsters.length), 1)[0]);
      while(desiredCR > totalCR(eventMonsters)) {
        if(monsters.length === 0) break;
        var toAdd = monsters.splice(Math.floor(Math.random() * monsters.length), 1)[0];
        eventMonsters.push(toAdd);
      }
      var leader = eventMonsters[0];
      if(leader === undefined) break;
      var event = new CombatEvent(leader.name, "You encounter a group of monsters led by a " + leader.name, eventMonsters, reward);
      combatEvents.push(event);
    }
    return combatEvents;
  }

  function totalCR(monsters) {
    //console.log(monsters);
    return monsters.reduce(function(value, monster) {
      if(monster === undefined) return 0;
      return value + monster.cr;
    }, 0);
  }

  function Player(name, hp, ac) {
    return {
      "name": name,
      "hp": hp,
      "ac": ac,
      "attack": 0,
      "damage": 0,
      "x": null,
      "y": null,
      inventory: [],

      attackRoll: function() {
        return Dice.d20() + this.attack;
      },

      damageRoll: function() {
        return Dice.d6() + this.damage;
      },

      takeDamage: function(amount, damageSource, customMessage) {
        this.hp -= amount;
        display();
        Combat.log(this.name + " takes " + amount + " damage from " + damageSource + ", leaving " + this.hp + " HP left.");
        if(this.hp <= 0) {
          var deathMessage = document.createElement("h2");
          deathMessage.style.color = "#3366ff";
          deathMessage.innerText = (customMessage ? customMessage : "You died due to " + damageSource);
          Combat.log(player.name + " dies.");
          gameOver = true;
          return true;
        } else {
          return false;
        }
      }
    };
  };

  function Event(name, text) {
    return {
      "name": name,
      "text": text,
      done: false,

      run: function(callback) {
        message(this, this.text);
        done = true;
        callback();
      }
    }
  };

  //Note this function is for NPCs only
  function Character(name, hp, ac, attack, damage, cr) {
    if(!cr) cr = Math.floor(hp / 10);
    return {
      "name": name,
      "hp": hp,
      "ac": ac,
      "attack": attack,
      "damage": damage,
      "cr": cr,

      attackRoll: function() {
        return Dice.d20() + this.attack;
      },

      damageRoll: function() {
        return Dice.d6() + this.damage;
      }
    }
  }

  function HealingEvent() {
    var healingEvent;

    var title = (namePrefixes[Math.floor(Math.random() * namePrefixes.length)]) + " Potion";

    var omenChoice = Math.floor(Math.random() * omens.length);
    var looksChoice = Math.floor(Math.random() * potionLooks.length);
    var settingChoice = Math.floor(Math.random() * settings.length);
    var text = settings[settingChoice]
    + potionLooks[looksChoice]
    + omens[omenChoice];
    healingEvent = new Event(title, text);

    var magnitude = magnitudeMap[settings[settingChoice]];
    var runEffect = effectMap[potionLooks[looksChoice]];

    healingEvent.run = function(callback) {
      message(this, this.name + "\n\n" + this.text
      , function() {
        var toRun = function() {
          if(this.text.indexOf("Your name changes as you approach the potion.") != -1) {
              player.name = "";
              for(var i = 0; i < 1 + (Math.random() * 10); i++) {
                player.name += "あんパン";
              }
          }
          display();
          getChoice(this, "Would you like to drink the potion?"
          , function(drinkPotion) {
            if(drinkPotion) {
              getInput(this, "Potions' effects are USUALLY stronger the faster you drink them. On a continuous scale of 1-10, you quickly would you like to drink the potion?"
              , function(speed) {
                if((!speed) || isNaN(speed) || (speed < 1) || (speed > 10)) {
                  player.ac -= 5;
                  player.inventory.push("Physical Manifestation of your Headache earned by failing to think of a number 1-10 when drinking a " + this.name);
                  message(this, "You try to think of how fast to drink the potion, but you fail. You leave sadly with a painful, slowing headache. It will be harder to dodge now."
                  , callback);
                  return;
                }
                runEffect(speed, magnitude, internalMap[omens[omenChoice]], (function() {
                  this.done = true;
                  callback();
                }).bind(this));
              });
            } else {
              message(this, "You leave the potion where it is and return to where you were before."
              , callback);
            }
          });
        }
        toRun.bind(this)();
      });
    };
    return healingEvent;
  }

  function CombatEvent(name, text, characters, reward) {
    var combatEvent = new Event(name, text);

    combatEvent.run = function(callback) {
      var originalCharacterCount = characters.length;
      message(this, text
      , function() {
        function combatRound() {
          var statusmessage = "You have " + player.hp + " HP left. Your enemies are:\n";
          var left = 0;
          for(var i = 0; i < characters.length; i++) {
            var character = characters[i];
            statusmessage += character.name + " with " + character.hp + " HP left.\n";
            left++;
          }
          for(var i = 0; i < originalCharacterCount - left; i++) {
            statusmessage += "\n";
          }
          message(this, statusmessage, function() {
            var padding = "\n";
            for(var i = 0; i < originalCharacterCount; i++) {
              padding += "\n";
            }
            getChoice(this, "Would you like to keep fighting?" + padding, function(inputValue) {
              if(!inputValue) {
                message(this, "You run away.", callback);
                return;
              }

              for(var i = 0; i < characters.length; i++) {
                var character = characters[i];
                var attackRoll = character.attackRoll();
                if(attackRoll >= player.ac) {
                  var damageRoll = character.damageRoll();

                  if(character.name === "Oboro \"Messenger of the Heavens\"") {
                    damageRoll += 7;
                    Combat.log(player.name + " takes additional 7 damage due to Oboro's masterful targeting of " + player.name + "'s pressure points.");
                  }

                  if(Dice.d20() === 20) {
                    damageRoll *= 3;
                    Combat.log(character.name + " scores a critical hit.", "red");
                  }
                  if(player.takeDamage(damageRoll, character.name)) return;
                } else {
                  Combat.log(character.name + " fails to hit " + player.name);
                }
              }

              var attackRoll = player.attackRoll();
              var character = characters[0];
              if(attackRoll >= character.ac) {
                var damageRoll = player.damageRoll();
                character.hp -= damageRoll;
                Combat.log(character.name + " takes " + damageRoll + " damage from " + player.name + ", leaving " + character.hp + " HP left.");
              } else {
                Combat.log(player.name + " fails to hit " + character.name);
              }

              if(character.hp <= 0) {
                Combat.log(character.name + " is defeated.");
                characters.splice(0, 1);
              }
              if(characters.length !== 0) {
                combatRound();
              } else {
                this.done = true;
                message(this, "You win the battle.", function() {
                  Combat.log(player.name + " wins battle.");
                  reward(callback);
                });
              }
            });
          });
        }
        combatRound = combatRound.bind(this);
        combatRound();
      });
    };

    return combatEvent;
  }

  function generateMap() {
    var map = [];

    for(var i = 0; i < mapWidth; i++) {
      map[i] = [];
      for(var j = 0; j < mapHeight; j++) {
        map[i].push({ event: null, explored: allDiscovered, passable: true});
      }
    }

    if(map.length * map[0].length < events.length + 10) {
      console.log("Insufficient map size to host events. Please try a bigger map.");
    }

    var desiredEvents = Math.ceil((mapWidth * mapHeight) / 2.5);
    var healingEvents = desiredEvents - events.length;
    for(var i = 0; i < healingEvents; i++) {
      events.push(new HealingEvent());
    }

    while(events.length != 0) {
      var event = events.pop();
      while(true) {
        var x = Math.round(Math.random() * (mapWidth - 1));
        var y = Math.round(Math.random() * (mapHeight - 1));
        if(map[x][y].event === null) {
          map[x][y].event = event;
          console.log(event.name + " at " + x + ", " + y);
          break;
        }
      }
    }

    while(true) {
      var x = Math.round(Math.random() * (mapWidth - 1));
      var y = Math.round(Math.random() * (mapHeight - 1));

      if(map[x][y].event === null) {
        player.x = x;
        player.y = y;
        map[x][y].explored = true;
        break;
      }
    }

    for(var i = 0; i < numberOfWalls; i++) {
      var maxTries = 85;
      var tries = 0;
      while(true) {
        if(!(++tries < maxTries)) {
          console.log("Passed maxTries for wall placement.");
          break;
        }
        var x = Math.round(Math.random() * (mapWidth - 1));
        var y = Math.round(Math.random() * (mapHeight - 1));

        if(map[x][y].event === null && player.x != x && player.y != y) {
          var skip = false;
          var wallCount = 0;
          var eventCount = 0;
          for(var r = x - 1; r <= x + 1; r++) {
            for(var j = y - 1; j <= y + 1; j++) {
              //console.log("Running r/x " + r + " and j/y" + j);
              try {
                //console.log("Skip " + !map[r][j].passable + " for " + " (" + r + ", " + j + ") at (" + x + ", " + y + ")");
                if(!map[r][j].passable) {
                  wallCount++;
                }
                if(map[r][j].event) {
                  eventCount++;
                }
              } catch(error) { wallCount += 0.7 }
            }
          }
          if((wallCount > 3) || (wallCount > 1 && eventCount > 0)) {
            skip = true;
          }
          if(skip) {
            //console.log("Skipped placement of wall at " + x + ", " + y);
            continue;
          }

          map[x][y].passable = false;
          console.log("Wall at " + x + ", " + y);
          break;
        }
      }
    }
    return map;
  }

  function display() {
    var hpDisplay = document.getElementById("hp-display");
    if(hpDisplay) {
      hpDisplay.innerHTML = "";
    }
    hpDisplay.innerHTML = player.name + " has " + player.ac + " AC, " + player.attack + " bonus attack, " + player.damage + " bonus damage, <strong>" + player.hp + " HP</strong> left.";

    var table = document.getElementById("map-table");
    if(table) {
      table.innerHTML = "";
    }

    for(var i = 0; i < mapWidth; i++) {
      var row = document.createElement("tr");
      for(var j = 0; j < mapHeight; j++) {
        var mapCell = map[j][i];

        var displayCell = document.createElement("td");
        if(player.x === j && player.y === i) {
          displayCell.innerText = player.name;
          displayCell.className = "player";
        } else if(mapCell.explored === true) {
          if(mapCell.event) {
            displayCell.innerHTML = mapCell.event.name;
            if(mapCell.event.done) {
              displayCell.className = "done";
            } else {
              displayCell.className = "event";
            }
          } else if(!mapCell.passable) {
            displayCell.innerHTML = "Wall";
            displayCell.className = "event";
          } else {
            displayCell.innerHTML = "Empty";
          }
        } else {
          displayCell.innerHTML = "Unknown";
          displayCell.className = "unknown";
        }

        row.appendChild(displayCell);
      }
      table.appendChild(row);
    }

    var inventoryContainer = document.getElementById("inventory-list");
    if(!inventoryContainer) {
      console.log("No Inventory Container in HTML.");
      return;
    }
    inventoryContainer.innerHTML = "";
    var li = document.createElement("li");
    li.innerHTML = "You have " + player.inventory.length + " item" + (player.inventory.length === 1 ? "" : "s") + ".";
    inventoryContainer.appendChild(li);
    for(var i = 0; i < player.inventory.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = player.inventory[i];
      inventoryContainer.appendChild(li);
    }

  }

  window.cheat = function() {
    player.ac = Infinity;
    player.damageRoll = function() { return Infinity };
    player.attackRoll = function() { return Infinity };
    display();
  }
});
