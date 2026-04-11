import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { Flare, FlareCategory } from "../types";

// ── Emergency trigger types ─────────────────────────────────

export interface EmergencyTrigger {
	source: "manual" | "flare" | "zone";
	flare?: Flare;
	category?: FlareCategory;
	location?: string;
	building?: string;
}

export interface EmergencyStep {
	instruction: string;
	detail: string;
}

// ── Context shape ───────────────────────────────────────────

interface EmergencyContextValue {
	isActive: boolean;
	isExitPromptVisible: boolean;
	trigger: EmergencyTrigger | null;
	steps: EmergencyStep[];
	activate: (trigger: EmergencyTrigger) => void;
	updateTrigger: (trigger: EmergencyTrigger) => void;
	requestExitPrompt: () => void;
	dismissExitPrompt: () => void;
	deactivate: () => void;
}

const EmergencyContext = createContext<EmergencyContextValue>({
	isActive: false,
	isExitPromptVisible: false,
	trigger: null,
	steps: [],
	activate: () => {},
	updateTrigger: () => {},
	requestExitPrompt: () => {},
	dismissExitPrompt: () => {},
	deactivate: () => {},
});

// ── Step generation (context-adaptive) ──────────────────────

const CAMPUS_SECURITY = "514-848-3717";

const SAFE_POINTS: Record<string, string> = {
	"Hall Building": "EV Building lobby, 1 min walk east on de Maisonneuve",
	"Henry F. Hall Building":
		"EV Building lobby, 1 min walk east on de Maisonneuve",
	"EV Building": "Hall Building lobby, 1 min walk west on de Maisonneuve",
	"Engineering, Computer Science and Visual Arts Integrated Complex":
		"Hall Building lobby, 1 min walk west on de Maisonneuve",
	"LB Building": "GM Building ground floor, 2 min walk south via Guy St",
	"Library Building": "GM Building ground floor, 2 min walk south via Guy St",
	"J.W. McConnell Building":
		"GM Building ground floor, 2 min walk south via Guy St",
	"GM Building": "LB Building lobby, 2 min walk north via Guy St",
	"Guy-De Maisonneuve Building":
		"LB Building lobby, 2 min walk north via Guy St",
	"MB Building": "Hall Building lobby via tunnel level",
	"John Molson Building": "Hall Building lobby via tunnel level",
	default: "the nearest staffed building lobby (Hall, EV, or LB)",
};

function generateSteps(trigger: EmergencyTrigger): EmergencyStep[] {
	const { flare, category, building } = trigger;
	const cat = category ?? flare?.category;
	const loc = building ?? flare?.building;
	const nearestSafe = loc
		? (SAFE_POINTS[loc] ?? SAFE_POINTS.default)
		: SAFE_POINTS.default;

	// Category-specific opening step
	const categoryStep = getCategoryStep(cat, flare);

	// Build steps
	const steps: EmergencyStep[] = [];

	// Step 1: immediate action (category-aware)
	if (categoryStep) {
		steps.push(categoryStep);
	} else {
		steps.push({
			instruction: "Assess your surroundings",
			detail:
				"If you feel unsafe, prepare to move. If indoors, locate the nearest exit. If outdoors, identify a safe direction away from the area.",
		});
	}

	// Step 2: move to safety
	steps.push({
		instruction: "Go to a safe location",
		detail: `Go to ${nearestSafe}. Avoid the reported disruption area and use an accessible entrance if needed.`,
	});

	// Step 3: contact help
	steps.push({
		instruction: "Contact help if needed",
		detail: `Call campus security at ${CAMPUS_SECURITY}. For life-threatening emergencies, call 911. Security desks are in Hall, EV, and LB lobbies.`,
	});

	// Step 4: wait
	steps.push({
		instruction: "Stay in your safe location",
		detail:
			"Stay where you are, check the Updates tab for new information, and do not return to the affected area until it is confirmed safe.",
	});

	return steps;
}

function getCategoryStep(
	category: FlareCategory | undefined,
	flare: Flare | undefined,
): EmergencyStep | null {
	const location = flare?.location ?? "the affected area";

	switch (category) {
		case "blocked_entrance":
			return {
				instruction: `Do not use ${flare?.entrance ? `the ${flare.entrance}` : "this entrance"}`,
				detail: `${location} is reported blocked. Use an alternate entrance or exit the building through a different door.`,
			};
		case "dense_crowd":
			return {
				instruction: "Avoid the crowded area",
				detail: `A dense crowd is reported at ${location}. Do not push through. Take an alternate route around the area.`,
			};
		case "access_restriction":
			return {
				instruction: "Avoid the restricted area",
				detail: `Access to ${location} is currently restricted. Do not attempt to enter. Follow posted signs or security instructions.`,
			};
		case "construction":
			return {
				instruction: "Use an alternate path around construction",
				detail: `${location} has active construction. The area may be unsafe. Use a different route around the obstruction.`,
			};
		default:
			return null;
	}
}

// ── Provider ────────────────────────────────────────────────

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
	const [isActive, setIsActive] = useState(false);
	const [isExitPromptVisible, setIsExitPromptVisible] = useState(false);
	const [trigger, setTrigger] = useState<EmergencyTrigger | null>(null);
	const [steps, setSteps] = useState<EmergencyStep[]>([]);

	const updateTrigger = useCallback((nextTrigger: EmergencyTrigger) => {
		setTrigger(nextTrigger);
		setSteps(generateSteps(nextTrigger));
	}, []);

	const activate = useCallback(
		(t: EmergencyTrigger) => {
			updateTrigger(t);
			setIsExitPromptVisible(false);
			setIsActive(true);
		},
		[updateTrigger],
	);

	const requestExitPrompt = useCallback(() => {
		setIsExitPromptVisible(true);
	}, []);

	const dismissExitPrompt = useCallback(() => {
		setIsExitPromptVisible(false);
	}, []);

	const deactivate = useCallback(() => {
		setIsActive(false);
		setIsExitPromptVisible(false);
		setTrigger(null);
		setSteps([]);
	}, []);

	const value = useMemo(
		() => ({
			isActive,
			isExitPromptVisible,
			trigger,
			steps,
			activate,
			updateTrigger,
			requestExitPrompt,
			dismissExitPrompt,
			deactivate,
		}),
		[
			isActive,
			isExitPromptVisible,
			trigger,
			steps,
			activate,
			updateTrigger,
			requestExitPrompt,
			dismissExitPrompt,
			deactivate,
		],
	);

	return (
		<EmergencyContext.Provider value={value}>
			{children}
		</EmergencyContext.Provider>
	);
}

export const useEmergency = () => useContext(EmergencyContext);
