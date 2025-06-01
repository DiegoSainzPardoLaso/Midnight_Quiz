"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { ThemeProvider } from "@/components/theme-provider"
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  BarChart3,
  TrendingUp,
  Home,
  AlertTriangle,
  Moon,
  Sun,
  Sparkles,
  Trophy,
  Target,
  Check,
  X,
  Minus,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  subject: string
  topic: string
  explanation?: string
}

interface QuestionWithShuffled extends Question {
  shuffledOptions: string[]
  shuffledCorrectAnswer: number
}

interface TopicStats {
  topic: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy: number
  score: number
  testAttempts: { score: number; timestamp: number }[]
}

interface MissedQuestion {
  question: string
  yourAnswer: string
  correctAnswer: string
  explanation?: string
  topic: string
}

interface QuestionSummary {
  question: string
  userAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  isAnswered: boolean
  topic: string
  explanation?: string
}

const mockQuestions: Question[] = 
[
  {
    "id": 1,
    "question": "What defines an enterprise in a free market capitalist system?",
    "options": [
      "A non-profit organization focused on donations",
      "A government-controlled production unit",
      "An entity that integrates organized elements to achieve economic goals",
      "A charitable organization providing free services"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An enterprise is an organized entity that performs economic activity to achieve specific goals and generate profit in a capitalist system."
  },
  {
    "id": 2,
    "question": "What is the formula to calculate profit?",
    "options": [
      "Revenue - Costs",
      "Revenue - (Expenses + Costs + Taxes)",
      "Revenue + Expenses - Taxes",
      "Revenue - Sales"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Profit or net income is calculated by subtracting all costs, expenses, and taxes from the total revenue."
  },
  {
    "id": 3,
    "question": "Who are considered stakeholders in a business?",
    "options": [
      "Only the customers",
      "Only the owners and employees",
      "Anyone affected by the business's success or failure",
      "Only the government and partners"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Stakeholders include anyone with a legitimate interest in the business, such as customers, employees, suppliers, partners, and local government."
  },
  {
    "id": 4,
    "question": "Which of the following is NOT a traditional factor of production?",
    "options": [
      "Land",
      "Labour",
      "Utility",
      "Capital"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Utility is the satisfaction from consuming goods, not a production factor. The traditional factors are land, labour, and capital."
  },
  {
    "id": 5,
    "question": "What distinguishes a capability from a resource?",
    "options": [
      "A capability is tangible and a resource is intangible",
      "A capability represents what a firm is expert in using its resources",
      "A resource is dynamic while a capability is static",
      "Resources cannot be measured while capabilities can"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Capabilities are dynamic and show how a firm uses its (especially intangible) resources effectively."
  },
  {
    "id": 6,
    "question": "Which sector involves turning raw materials into components or finished goods?",
    "options": [
      "Primary",
      "Tertiary",
      "Quaternary",
      "Secondary"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The secondary sector involves manufacturing and assembly of raw materials into usable products."
  },
  {
    "id": 7,
    "question": "Which of the following best describes an open system in business?",
    "options": [
      "A system that avoids external influence",
      "A system that does not adapt or grow",
      "A system that interacts and adapts with its environment",
      "A system that never changes its structure"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An open system continuously interacts with and adapts to changes in its environment."
  },
  {
    "id": 8,
    "question": "What does the value chain of a firm represent?",
    "options": [
      "The amount of value lost due to inefficiency",
      "The set of unrelated activities performed by a company",
      "Activities that do not contribute to profit generation",
      "A set of activities carried out to deliver value to customers"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The value chain consists of all activities performed to create and deliver valuable goods or services to customers."
  },
  {
    "id": 9,
    "question": "Which of these is an intangible resource?",
    "options": [
      "Factory equipment",
      "Company car fleet",
      "Human capital",
      "Office furniture"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Human capital, like knowledge and skills, is an intangible resource not found on balance sheets."
  },
  {
    "id": 10,
    "question": "Which of the following forces is considered an external influence on business activities?",
    "options": [
      "Company hierarchy",
      "Organizational routines",
      "Technological forces",
      "Divisional objectives"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Technological forces are one of the external macro-environmental factors that influence businesses."
  },
  {
    "id": 11,
    "question": "What best describes an enterprise in a free-market capitalist system?",
    "options": [
      "A non-profit social unit",
      "An entity that redistributes wealth",
      "An organized unit that produces goods and services for profit",
      "A government-controlled body"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An enterprise is a legal entity that integrates organized elements to produce goods and services for profit."
  },
  {
    "id": 12,
    "question": "Which of the following is a component of profit calculation?",
    "options": [
      "Wages only",
      "Revenue and total sales",
      "Revenue minus (expenses + costs + taxes)",
      "Revenue minus liabilities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Profit is calculated as revenue minus expenses, costs, and taxes."
  },
  {
    "id": 13,
    "question": "What role do employees play in a business?",
    "options": [
      "They invest money in the company",
      "They provide legal advice",
      "They help the business achieve its goals through work",
      "They purchase the company's products"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Employees contribute labor to help achieve business goals."
  },
  {
    "id": 14,
    "question": "Which of the following is a traditional factor of production?",
    "options": [
      "Knowledge",
      "Information",
      "Reputation",
      "Land"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Traditional factors of production include land, labor, and capital."
  },
  {
    "id": 15,
    "question": "What defines utility in economics?",
    "options": [
      "The ability to sell a product",
      "The financial cost of goods",
      "The satisfaction derived from consuming goods or services",
      "The market demand of a product"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Utility refers to the satisfaction people derive from consuming goods and services."
  },
  {
    "id": 16,
    "question": "Which sector is involved in the extraction of raw materials?",
    "options": [
      "Primary",
      "Secondary",
      "Tertiary",
      "Quaternary"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The primary sector involves acquiring raw materials through extraction."
  },
  {
    "id": 17,
    "question": "What is the simplest form of business ownership?",
    "options": [
      "Corporation",
      "Partnership",
      "Individual proprietorship",
      "Franchise"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An individual proprietorship is the simplest business form with a single owner."
  },
  {
    "id": 18,
    "question": "Which of the following is NOT a tangible asset?",
    "options": [
      "Equipment",
      "Stocks",
      "Patents",
      "Receivables"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Patents are intangible assets, not included in the balance sheet as tangible items."
  },
  {
    "id": 19,
    "question": "What defines a capability within a firm?",
    "options": [
      "A physical resource",
      "An accounting method",
      "An area of expertise in valuable activity",
      "A legal contract"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "A capability is what a firm is expert in and involves coordination across departments."
  },
  {
    "id": 20,
    "question": "Which is a requirement for a capability to be a source of competitive advantage?",
    "options": [
      "It is visible in financial reports",
      "It is easy to imitate",
      "It is durable and hard to replace",
      "It is shared with suppliers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "A competitive advantage must be relevant, durable, rare, and hard to imitate or transfer."
  },
  {
    "id": 21,
    "question": "What does the term 'value chain' refer to?",
    "options": [
      "The monetary value of all the company's stock",
      "The firm's ownership structure",
      "The set of activities that add value to the product",
      "The supply chain of a country"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The value chain includes all activities that add value to a product or service for the customer."
  },
  {
    "id": 22,
    "question": "What is the margin in value creation?",
    "options": [
      "The cost of raw materials",
      "The profit from sales after all costs",
      "The number of units sold",
      "The value of intangible resources"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Margin is the difference between total value received and total cost incurred."
  },
  {
    "id": 23,
    "question": "Which is considered an external force influencing business activities?",
    "options": [
      "R&D Department",
      "Sales team",
      "Political changes",
      "Organizational culture"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Political forces are external factors that can impact a business environment."
  },
  {
    "id": 24,
    "question": "What kind of system is a business that can adapt and compete in the environment?",
    "options": [
      "Closed system",
      "Rigid system",
      "Open system",
      "Linear system"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An open system interacts with and adapts to its environment, enabling growth and competition."
  },
  {
    "id": 25,
    "question": "Which of the following is NOT part of the logistics process?",
    "options": [
      "Production",
      "Sales",
      "Purchase",
      "Administration"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Administration is part of the directive process, not the logistics process."
  },
  {
    "id": 26,
    "question": "What are the three key questions in strategic dimensions?",
    "options": [
      "When, Where, Why",
      "How, What, Where",
      "What, How, Who",
      "Who, Why, When"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Strategic analysis often addresses: What needs are satisfied? How are they satisfied? Who are the customers?"
  },
  {
    "id": 27,
    "question": "What is a strategic problem?",
    "options": [
      "A temporary sales drop",
      "A marketing error",
      "A mismatch between environment threats and firm weaknesses",
      "A lack of employee motivation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "A strategic problem arises when internal weaknesses meet external threats."
  },
  {
    "id": 28,
    "question": "What is the primary focus of a quality-oriented strategy?",
    "options": [
      "Maximizing marketing spend",
      "Employee satisfaction",
      "Eliminating all competition",
      "Customer satisfaction and continuous improvement"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Quality strategies focus on satisfying customers and continuously improving processes."
  },
  {
    "id": 29,
    "question": "What defines a stakeholder?",
    "options": [
      "Only company owners",
      "Only employees",
      "Any individual or group affected by or interested in the company",
      "Only customers and suppliers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Stakeholders include anyone with a legitimate interest in a business’s success or failure."
  },
  {
    "id": 30,
    "question": "Which of the following is an intangible resource?",
    "options": [
      "Building",
      "Human capital",
      "Machinery",
      "Inventory"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Human capital, including skills and knowledge, is an intangible asset not shown in balance sheets."
  },
  {
    "id": 31,
    "question": "What is an enterprise in a free-market capitalist system?",
    "options": [
      "An association of workers with shared rights",
      "A non-profit institution with tax exemptions",
      "A legal unit that integrates organized elements to produce goods and services for profit",
      "A firm funded exclusively by the government"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "According to the summary, an enterprise is a legal unit that integrates organized elements to produce goods and services for profit."
  },
  {
    "id": 32,
    "question": "What is the objective of an enterprise?",
    "options": [
      "To minimize external competition",
      "To produce only for its shareholders",
      "To obtain economic benefits from its activity",
      "To focus exclusively on labor rights"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The objective of an enterprise is to obtain economic benefits from its activity."
  },
  {
    "id": 33,
    "question": "How is profit calculated?",
    "options": [
      "Revenue minus employee wages",
      "Total income minus equity",
      "Revenue minus (expenses + costs + taxes)",
      "Revenue plus capital investments"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Profit is calculated as: revenue - (expenses + costs + taxes)."
  },
  {
    "id": 34,
    "question": "What are the traditional factors of production?",
    "options": [
      "Technology, services, branding",
      "Land, labor, and capital",
      "Patents, logistics, and markets",
      "Information, design, and sales"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The traditional factors of production are land, labor, and capital."
  },
  {
    "id": 35,
    "question": "What is the primary objective of business activity?",
    "options": [
      "To increase taxes",
      "To reduce investment risks",
      "To create value through producing goods or services",
      "To ensure equal distribution of income"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The primary objective of business activity is to create value through producing goods or services."
  },
  {
    "id": 36,
    "question": "What is the difference between utility and value?",
    "options": [
      "Utility is financial; value is emotional",
      "Utility refers to cost; value refers to quality",
      "Utility is the satisfaction the good produces; value is what one is willing to give up to get it",
      "They mean exactly the same"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Utility is the satisfaction a good produces, while value is what one is willing to give up to get it."
  },
  {
    "id": 37,
    "question": "What is a capability in the context of a company?",
    "options": [
      "A technical manual available to all employees",
      "A warehouse for storing goods",
      "An area in which the firm is expert and which spans multiple departments",
      "An administrative document"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "A capability is an area in which the firm is expert, requiring coordination across multiple departments."
  },
  {
    "id": 38,
    "question": "What are the characteristics that make a capability a source of competitive advantage?",
    "options": [
      "It is well-known, documented, and costly",
      "It is durable, rare, relevant, and difficult to imitate",
      "It is easy to replace and scalable",
      "It is stored in tangible resources"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "For a capability to be a source of competitive advantage, it must be relevant, durable, rare, and difficult to imitate or transfer."
  },
  {
    "id": 39,
    "question": "What are stakeholders?",
    "options": [
      "Only company investors and employees",
      "Government agencies monitoring business activity",
      "All individuals or groups who are affected by or interested in a company",
      "Customers and competitors"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Stakeholders are all individuals or groups affected by or interested in the company."
  },
  {
    "id": 40,
    "question": "What is an open system in business theory?",
    "options": [
      "A system that avoids external influence",
      "A company that only operates internally",
      "A system that is affected by and adapts to its environment",
      "An automated information system"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "An open system is a system that is affected by and adapts to its environment."
  },
  {
    "id": 41,
    "question": "What are the economic agents in a market economy?",
    "options": [
      "Producers, suppliers, and distributors",
      "Enterprises, families, and the state",
      "Banks, investors, and consumers",
      "Managers, employees, and shareholders"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "In a market economy, the main economic agents are enterprises, families, and the state."
  },
  {
    "id": 42,
    "question": "What does the internal environment of a company include?",
    "options": [
      "Socio-cultural norms and legal factors",
      "Suppliers and government regulations",
      "Elements that form part of the company and can be controlled by it",
      "Clients and competitors"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The internal environment includes elements that form part of the company and can be controlled by it."
  },
  {
    "id": 43,
    "question": "What is the external environment?",
    "options": [
      "Anything that happens inside the company's facilities",
      "Everything that does not form part of the company but affects it",
      "A set of internal strategic policies",
      "The stock value and brand image"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The external environment is everything that does not form part of the company but affects it."
  },
  {
    "id": 44,
    "question": "What is the market?",
    "options": [
      "A type of internal organization model",
      "The institution where companies file taxes",
      "The meeting point between supply and demand",
      "An environment of capital accumulation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The market is the meeting point between supply and demand."
  },
  {
    "id": 45,
    "question": "What does demand represent?",
    "options": [
      "The number of suppliers in a market",
      "The sum of offers made by producers",
      "The quantity of goods and services that consumers want and can buy",
      "The minimum price that sellers accept"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Demand represents the quantity of goods and services that consumers want and can buy."
  },
  {
    "id": 46,
    "question": "What is supply in economic terms?",
    "options": [
      "The number of taxes the state collects from firms",
      "The quantity of goods and services that companies are willing to produce and sell",
      "The net income after production costs",
      "The availability of raw materials in a region"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Supply is the quantity of goods and services that companies are willing to produce and sell."
  },
  {
    "id": 47,
    "question": "What is the equilibrium price?",
    "options": [
      "The average cost of production",
      "The government-imposed minimum price",
      "The price at which supply equals demand",
      "The highest price consumers are willing to pay"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The equilibrium price is the price at which supply equals demand."
  },
  {
    "id": 48,
    "question": "Which term describes the people or groups that contribute capital to the company?",
    "options": [
      "Stakeholders",
      "Shareholders",
      "Competitors",
      "Clients"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "Shareholders are the people or groups that contribute capital to the company."
  },
  {
    "id": 49,
    "question": "What are the four subsystems of the company?",
    "options": [
      "Administrative, human resources, commercial, and security",
      "Capital, workforce, innovation, and logistics",
      "Direction, production, financing, and commercialization",
      "Input, processing, output, and feedback"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The four subsystems of the company are: direction, production, financing, and commercialization."
  },
  {
    "id": 50,
    "question": "What is the aim of the commercial subsystem?",
    "options": [
      "To manage internal documentation and HR policies",
      "To plan the urban presence of the company",
      "To adapt the product to the consumer and sell it in the best possible conditions",
      "To negotiate raw material prices with suppliers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.1",
    "explanation": "The commercial subsystem aims to adapt the product to the consumer and sell it in the best possible conditions."
  },
  {
    "id": 51,
    "question": "What does a high level of entrepreneurship typically imply?",
    "options": [
      "Only high levels of job security",
      "Low levels of innovation",
      "High levels of business creation and destruction",
      "Stable and risk-free markets"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A high level of entrepreneurship means high levels of business creation but also destruction."
  },
  {
    "id": 52,
    "question": "What is the starting point of a new business?",
    "options": [
      "The business model",
      "The financial plan",
      "The idea",
      "The legal structure"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A starting point is the IDEA; it should be based on a business opportunity and market need."
  },
  {
    "id": 53,
    "question": "Which of the following best describes innovation in entrepreneurship?",
    "options": [
      "Applying traditional methods efficiently",
      "Using existing models with minor changes",
      "Implementing creative ideas into products, processes, or systems",
      "Avoiding risk by copying competitors"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Innovation involves implementing new creative ideas in the form of products, systems, or solutions."
  },
  {
    "id": 54,
    "question": "Which of the following is NOT considered one of the entrepreneur’s functions according to the summary?",
    "options": [
      "Opening a new market",
      "Copying existing business models",
      "Introducing new goods or services",
      "Creating a new organization in one sector"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Copying existing business models is not part of the entrepreneurial functions which emphasize new combinations."
  },
  {
    "id": 55,
    "question": "Which type of risk does an entrepreneur typically accept?",
    "options": [
      "Only social risks",
      "Technical and economic risks",
      "No risks at all",
      "Environmental risks"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs accept uncertainty including technical and economic risks."
  },
  {
    "id": 56,
    "question": "Why is the creation of new ventures important?",
    "options": [
      "It increases government control over industries",
      "It boosts economic development and business dynamics",
      "It reduces employment rates",
      "It increases market monopolies"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "New ventures are vital for economic development, resource allocation, and industry networks."
  },
  {
    "id": 57,
    "question": "What does GEM stand for?",
    "options": [
      "General Economic Management",
      "Global Entrepreneurial Model",
      "Global Entrepreneurship Monitor",
      "Growth and Enterprise Market"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "GEM stands for Global Entrepreneurship Monitor, the world’s foremost study of entrepreneurship."
  },
  {
    "id": 58,
    "question": "What does TEA refer to in the context of entrepreneurship?",
    "options": [
      "Technology for Entrepreneurial Activities",
      "Total Economic Allocation",
      "Total Early-stage Entrepreneurial Activity",
      "Trade and Enterprise Agreement"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "TEA refers to Total Early-stage Entrepreneurial Activity as measured by GEM."
  },
  {
    "id": 59,
    "question": "What group has recently shown an increasing rate of entrepreneurial activity according to GEM reports?",
    "options": [
      "Middle-aged men",
      "Young adults",
      "Elderly people",
      "Government employees"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "The rate of entrepreneurial activity among younger groups exceeds that of older groups in many economies."
  },
  {
    "id": 60,
    "question": "What is one of the main motivations for women to become entrepreneurs?",
    "options": [
      "To avoid taxes",
      "To reduce working hours",
      "To access economic expression and opportunity",
      "To become celebrities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurship offers women economic expression and increasing opportunities."
  },
  {
    "id": 61,
    "question": "Which of the following is NOT a personal characteristic associated with entrepreneurs?",
    "options": [
      "Initiative",
      "Willingness to take risks",
      "Dependence on others",
      "Creativity"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs are typically independent, not dependent on others, and show initiative and creativity."
  },
  {
    "id": 62,
    "question": "According to Schumpeter, what is the essence of entrepreneurship?",
    "options": [
      "Maximizing profits",
      "Maintaining stability in markets",
      "Innovation and creative destruction",
      "Avoiding competition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Schumpeter defined entrepreneurship as the driver of innovation and creative destruction."
  },
  {
    "id": 63,
    "question": "Which of the following best describes the term 'creative destruction'?",
    "options": [
      "Destruction of physical resources to create new ones",
      "Replacing old products and processes with innovative ones",
      "Destroying competition using aggressive strategies",
      "Reducing costs by eliminating quality"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Creative destruction involves the replacement of outdated products, services, and processes with new, innovative ones."
  },
  {
    "id": 64,
    "question": "What is a common motivation for becoming an entrepreneur?",
    "options": [
      "Desire for routine and predictability",
      "Access to government benefits",
      "Desire for independence and personal growth",
      "Fear of innovation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Many entrepreneurs are motivated by a desire for independence and the opportunity for personal and professional growth."
  },
  {
    "id": 65,
    "question": "Which of the following is an example of an entrepreneurial opportunity?",
    "options": [
      "An oversaturated market",
      "A drop in product demand",
      "An unmet customer need",
      "High entry barriers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurial opportunities often arise from identifying unmet or underserved customer needs."
  },
  {
    "id": 66,
    "question": "Entrepreneurship contributes to which of the following at the macroeconomic level?",
    "options": [
      "Decline in innovation",
      "Market stagnation",
      "Job creation and economic growth",
      "Increase in monopolies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurship is a key factor in job creation and fostering economic growth."
  },
  {
    "id": 67,
    "question": "Which term refers to the combination of knowledge, skills, and motivation needed to start a business?",
    "options": [
      "Social capital",
      "Entrepreneurial capacity",
      "Market economy",
      "Competitive advantage"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurial capacity includes knowledge, skills, attitudes, and motivation required to launch a business."
  },
  {
    "id": 68,
    "question": "Which of the following indicators is used by GEM to measure entrepreneurship?",
    "options": [
      "GDP per capita",
      "Unemployment rate",
      "TEA (Total Early-stage Entrepreneurial Activity)",
      "Inflation index"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "GEM uses TEA to measure early-stage entrepreneurial activity across countries."
  },
  {
    "id": 69,
    "question": "Which factor often encourages necessity-based entrepreneurship?",
    "options": [
      "Strong job market",
      "Lack of formal employment opportunities",
      "High level of venture capital",
      "Stable government support"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Necessity-based entrepreneurship is often driven by a lack of employment opportunities."
  },
  {
    "id": 70,
    "question": "How can entrepreneurship help in reducing social inequalities?",
    "options": [
      "By concentrating wealth in fewer hands",
      "By generating employment and promoting inclusion",
      "By automating jobs",
      "By avoiding taxation"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurship can reduce inequalities by generating jobs and offering opportunities to marginalized groups."
  },
  {
    "id": 71,
    "question": "Which of the following best describes the entrepreneur's role in the economy?",
    "options": [
      "Following instructions from government agencies",
      "Executing orders from large corporations",
      "Identifying opportunities and mobilizing resources to exploit them",
      "Avoiding innovation to maintain stability"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs play a key role by identifying opportunities and mobilizing resources to take advantage of them."
  },
  {
    "id": 72,
    "question": "Which of the following is NOT typically a reason someone becomes an entrepreneur?",
    "options": [
      "Desire for independence",
      "Pursuit of profit",
      "Interest in social change",
      "Preference for job security"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs often take risks and give up job security in exchange for independence and potential rewards."
  },
  {
    "id": 73,
    "question": "What is a key characteristic of opportunity-driven entrepreneurship?",
    "options": [
      "Starting a business out of desperation",
      "Focusing only on short-term survival",
      "Launching a venture based on identified market gaps",
      "Avoiding innovation and risk"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Opportunity-driven entrepreneurs identify and exploit market gaps with innovative solutions."
  },
  {
    "id": 74,
    "question": "Which of the following is a common myth about entrepreneurs?",
    "options": [
      "They take calculated risks",
      "They are born, not made",
      "They are innovative",
      "They seek opportunities"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A common myth is that entrepreneurs are born, not made; in reality, entrepreneurial skills can be developed."
  },
  {
    "id": 75,
    "question": "Which institutional factor most directly supports entrepreneurship?",
    "options": [
      "Strict regulations",
      "Lack of financial infrastructure",
      "Supportive education and training",
      "High taxation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Supportive education and training systems foster the skills needed for entrepreneurship."
  },
  {
    "id": 76,
    "question": "Which type of entrepreneur focuses primarily on solving social problems?",
    "options": [
      "Serial entrepreneur",
      "Necessity entrepreneur",
      "Social entrepreneur",
      "Technological entrepreneur"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Social entrepreneurs prioritize creating positive social change over profit maximization."
  },
  {
    "id": 77,
    "question": "What is one common barrier to entrepreneurship?",
    "options": [
      "Abundant funding",
      "Strong support networks",
      "Lack of access to capital",
      "Government subsidies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A lack of access to capital is a major obstacle many aspiring entrepreneurs face."
  },
  {
    "id": 78,
    "question": "Which of the following is a benefit of entrepreneurship for society?",
    "options": [
      "Discouraging innovation",
      "Increasing unemployment",
      "Fostering competition and innovation",
      "Concentrating wealth in monopolies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurship fosters competition and innovation, which benefits consumers and the economy."
  },
  {
    "id": 79,
    "question": "Which of these best reflects a risk an entrepreneur might face?",
    "options": [
      "Guaranteed profits",
      "Stable monthly salary",
      "Business failure",
      "Free public funding"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs assume the risk of failure, which is a core aspect of starting a business."
  },
  {
    "id": 80,
    "question": "Which European initiative supports entrepreneurship through education?",
    "options": [
      "Erasmus for Entrepreneurs",
      "ECOFIN",
      "CAP (Common Agricultural Policy)",
      "Horizon Europe"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Erasmus for Entrepreneurs is an EU program that supports cross-border entrepreneurship training and mentorship."
  },
  {
    "id": 81,
    "question": "Which of the following best describes 'intrapreneurship'?",
    "options": [
      "Starting a business without any funding",
      "Investing in other people’s startups",
      "Acting entrepreneurially within an existing organization",
      "Launching a business in a rural environment"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Intrapreneurship refers to entrepreneurial behavior by employees within a company to develop new products or services."
  },
  {
    "id": 82,
    "question": "What is a 'startup' typically characterized by?",
    "options": [
      "A well-established market position",
      "Low risk and stable returns",
      "High growth potential and innovation",
      "Guaranteed government funding"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Startups are young businesses focused on innovation and rapid growth, often under conditions of high uncertainty."
  },
  {
    "id": 83,
    "question": "Which of the following is most likely a motivation for a necessity entrepreneur?",
    "options": [
      "Desire to innovate",
      "Lack of employment alternatives",
      "Access to venture capital",
      "Support from business incubators"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Necessity entrepreneurs start businesses due to a lack of other employment opportunities."
  },
  {
    "id": 84,
    "question": "Which factor is most likely to encourage entrepreneurship in a country?",
    "options": [
      "Complex bureaucracy and red tape",
      "Strong property rights and legal protection",
      "High levels of corruption",
      "Lack of digital infrastructure"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A solid legal framework and property rights encourage investment and entrepreneurial activity."
  },
  {
    "id": 85,
    "question": "What is a business incubator?",
    "options": [
      "A government agency that enforces labor laws",
      "A tool for market analysis",
      "An organization that supports startups with resources and mentoring",
      "A type of financial penalty for business failure"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Business incubators provide guidance, mentoring, and support services to help new businesses grow."
  },
  {
    "id": 86,
    "question": "What is a common personal trait among successful entrepreneurs?",
    "options": [
      "Aversion to change",
      "Risk aversion",
      "Resilience and perseverance",
      "Reliance on others to make decisions"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Resilience helps entrepreneurs push through setbacks and continue pursuing their goals."
  },
  {
    "id": 87,
    "question": "How does entrepreneurship contribute to economic development?",
    "options": [
      "By reducing competition",
      "By encouraging monopolies",
      "By creating jobs and stimulating innovation",
      "By increasing public sector spending"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurship is a key factor in job creation and fostering economic growth."
  },
  {
    "id": 88,
    "question": "What does 'scalability' mean in the context of a startup?",
    "options": [
      "The ability to produce physical goods",
      "Capacity to expand rapidly without proportional cost increase",
      "The need to hire many workers quickly",
      "Access to physical office space"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "A scalable startup can grow revenue significantly while keeping costs relatively low."
  },
  {
    "id": 89,
    "question": "Which of these sources is most commonly used for initial startup funding?",
    "options": [
      "Public stock exchange",
      "Crowdfunding platforms",
      "Personal savings and friends/family",
      "Bank-issued corporate bonds"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Many entrepreneurs begin with funding from personal savings or loans from family and friends."
  },
  {
    "id": 90,
    "question": "Which of the following is a legal form often used by entrepreneurs in Spain?",
    "options": [
      "Sole proprietorship (autónomo)",
      "State enterprise",
      "International NGO",
      "European Council Company"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "The 'autónomo' is a common legal form for individual entrepreneurs in Spain."
  },
   {
    "id": 91,
    "question": "What is the difference between an entrepreneur and a manager?",
    "options": [
      "Entrepreneurs work for others; managers do not",
      "Managers create businesses from scratch",
      "Entrepreneurs take the risk to start a business; managers oversee operations",
      "There is no difference"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs take the initiative and risks to start businesses, while managers maintain and control existing operations."
  },
  {
    "id": 92,
    "question": "Which of these is an example of social entrepreneurship?",
    "options": [
      "Launching a luxury car brand",
      "Opening a franchise restaurant",
      "Creating a business that provides clean water to underserved communities",
      "Speculating in real estate"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Social entrepreneurship addresses social problems, like providing clean water, using innovative business models."
  },
  {
    "id": 93,
    "question": "What does 'bootstrapping' mean in entrepreneurship?",
    "options": [
      "Hiring only family members",
      "Starting a business without external funding",
      "Copying another business idea",
      "Franchising a business model"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Bootstrapping refers to starting and growing a business with minimal external capital, relying on internal resources."
  },
  {
    "id": 94,
    "question": "Which factor most influences entrepreneurial activity in a country?",
    "options": [
      "Strict employment laws",
      "Political instability",
      "Access to capital and supportive infrastructure",
      "Lack of education"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurial activity thrives in environments with access to funding, education, and infrastructure."
  },
  {
    "id": 95,
    "question": "What is meant by 'intrapreneurship'?",
    "options": [
      "Becoming an entrepreneur at an early age",
      "Starting multiple businesses at once",
      "Acting like an entrepreneur within an existing organization",
      "Selling a business to a competitor"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Intrapreneurship is when employees use entrepreneurial skills within a company to develop new ideas and solutions."
  },
  {
    "id": 96,
    "question": "Which one of the following is not typically associated with entrepreneurship?",
    "options": [
      "Risk-taking",
      "Innovation",
      "Job seeking",
      "Opportunity recognition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Entrepreneurs typically create jobs rather than seek them."
  },
  {
    "id": 97,
    "question": "Why is market research important for entrepreneurs?",
    "options": [
      "To delay business planning",
      "To avoid innovation",
      "To understand customer needs and preferences",
      "To eliminate competitors"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Market research helps entrepreneurs identify and address customer demands effectively."
  },
  {
    "id": 98,
    "question": "Which is a key characteristic of a scalable business model?",
    "options": [
      "Limited customer base",
      "Low growth potential",
      "Revenue increases without equivalent rise in costs",
      "Strict local regulation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Scalable models grow revenue faster than costs, making them attractive to investors."
  },
  {
    "id": 99,
    "question": "What is the primary role of a business incubator?",
    "options": [
      "To invest in real estate",
      "To regulate startups",
      "To support new businesses through mentorship and resources",
      "To eliminate competition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Business incubators help startups grow by offering mentoring, resources, and networking."
  },
  {
    "id": 100,
    "question": "Which of the following best represents a growth entrepreneur?",
    "options": [
      "Someone satisfied with a small local business",
      "An individual who expands a startup into a multinational company",
      "A part-time crafts seller",
      "A retiree managing a personal blog"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "1.2",
    "explanation": "Growth entrepreneurs aim to scale their businesses significantly, often going international."
  },
    {
    "id": 101,
    "question": "Which of the following is a key characteristic of a business opportunity?",
    "options": [
      "Low production cost",
      "Attractive, timely, and anchored in a product or service",
      "Immediate profitability",
      "A novel idea"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A business opportunity must be attractive, timely, durable, and anchored in a product or service to be viable."
  },
  {
    "id": 102,
    "question": "What is the main difference between an idea and an opportunity?",
    "options": [
      "An opportunity is more creative",
      "An idea requires funding while an opportunity doesn’t",
      "An opportunity has market demand and value potential",
      "An idea is always profitable"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Not all ideas are opportunities—opportunities imply value, demand, and potential for market success."
  },
  {
    "id": 103,
    "question": "Which of the following is an example of an opportunity driver?",
    "options": [
      "High employee turnover",
      "Entrepreneurial leadership",
      "Outdated infrastructure",
      "Low-quality suppliers"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Entrepreneurial leadership is an opportunity driver through new vision and strategic thinking."
  },
  {
    "id": 104,
    "question": "What is a market window in the context of opportunity recognition?",
    "options": [
      "A time when markets are closed",
      "A brief period when a product can succeed",
      "A long-term trend in market behavior",
      "An investor presentation period"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A market window refers to a limited time frame during which a new product or service can successfully enter the market."
  },
  {
    "id": 105,
    "question": "What trend involves collaboration between large corporations and startups?",
    "options": [
      "Rural entrepreneurship",
      "E-health",
      "Open innovation",
      "Nation branding"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Open innovation involves cooperation between large companies and smaller innovative firms to drive progress."
  },
  {
    "id": 106,
    "question": "Which of these best describes social entrepreneurship?",
    "options": [
      "A non-profit business with no commercial goals",
      "Creating business models for large-scale corporations",
      "Combining social mission with entrepreneurial drive",
      "Focusing on market share above all"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Social entrepreneurship focuses on solving societal problems with innovative business models."
  },
  {
    "id": 107,
    "question": "Why is customer focus considered an opportunity driver?",
    "options": [
      "It allows businesses to increase product prices",
      "It targets new or underserved customer segments",
      "It guarantees viral marketing",
      "It decreases production costs"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Focusing on underserved or emerging customer segments can uncover unmet needs and new opportunities."
  },
  {
    "id": 108,
    "question": "Which economic factor is essential in determining a business opportunity’s viability?",
    "options": [
      "Gross margin and direct cost control",
      "Employee job satisfaction",
      "Location of headquarters",
      "Number of shareholders"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A strong gross margin and effective cost control are essential for determining the profitability of a business opportunity."
  },
  {
    "id": 109,
    "question": "How does eco-friendly orientation influence opportunity recognition?",
    "options": [
      "It limits market size",
      "It creates regulatory barriers",
      "It drives innovation with sustainable practices",
      "It increases operating costs only"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Sustainability creates new opportunities by encouraging innovative, low-impact solutions that appeal to socially conscious consumers."
  },
  {
    "id": 110,
    "question": "What is meant by strategic differentiation in business opportunities?",
    "options": [
      "Competing only on price",
      "Entering the market with the same offer as others",
      "Gaining an edge through timing, technology, or management",
      "Focusing solely on brand aesthetics"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Strategic differentiation involves gaining a competitive edge through unique resources, timing, or other strategic factors."
  },
  {
    "id": 111,
    "question": "Which of the following best explains why opportunities are situational?",
    "options": [
      "They depend on government funding",
      "They rely on an entrepreneur’s education level",
      "They arise under specific market conditions and timing",
      "They are always available regardless of context"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Opportunities are dependent on context, timing, and current market conditions."
  },
  {
    "id": 112,
    "question": "Why is recognizing the right moment important in launching a business opportunity?",
    "options": [
      "Because it ensures maximum employee motivation",
      "Because it increases the chances of market acceptance",
      "Because competitors will help with distribution",
      "Because legal regulations are irrelevant"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Timing is crucial to entering the market when demand is ripe and before competitors take the lead."
  },
  {
    "id": 113,
    "question": "Which of the following best demonstrates entrepreneurial leadership?",
    "options": [
      "Maintaining old systems to avoid risk",
      "Following traditional management practices",
      "Implementing a new vision and strategy",
      "Delegating all decisions to external consultants"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Entrepreneurial leadership involves creating a new vision and driving innovation within the organization."
  },
  {
    "id": 114,
    "question": "What role does digitalization play in opportunity recognition?",
    "options": [
      "It reduces business visibility",
      "It limits access to foreign markets",
      "It allows for revisiting and innovating old projects",
      "It increases traditional paperwork"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Digitalization enables the rethinking and transformation of outdated business ideas into modern opportunities."
  },
  {
    "id": 115,
    "question": "Why is focusing on fragmented traditional sectors a good strategy for entrepreneurs?",
    "options": [
      "These sectors are protected by law",
      "They are less saturated and open to innovation",
      "They require no investment",
      "They have stable customer bases that resist change"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Fragmented sectors often lack innovation and present opportunities for new entrants to differentiate."
  },
  {
    "id": 116,
    "question": "Which of the following is considered a force that makes business opportunities successful?",
    "options": [
      "Consumer behavior",
      "Employee dress code",
      "CEO’s personal branding",
      "Office location"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Consumer behavior and user experience are crucial in validating and sustaining business opportunities."
  },
  {
    "id": 117,
    "question": "How does the concept of 'value-added potential' impact business decisions?",
    "options": [
      "It focuses only on product design",
      "It ignores competitor actions",
      "It helps assess the strategic worth of a business offer",
      "It reduces the need for differentiation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Value-added potential indicates the strategic value of a business within its industry and market."
  },
  {
    "id": 118,
    "question": "What is the effect of extremely high capital requirements on new business ventures?",
    "options": [
      "They encourage faster growth",
      "They increase the venture’s attractiveness",
      "They may render the venture unrealistic",
      "They reduce investor interest"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "High capital requirements can discourage investment and make a venture less feasible."
  },
  {
    "id": 119,
    "question": "Which of the following trends fosters entrepreneurship in rural areas?",
    "options": [
      "Digital taxation",
      "Rural entrepreneurship",
      "Open innovation",
      "E-health"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Rural entrepreneurship aims to reactivate remote areas by encouraging new business creation."
  },
  {
    "id": 120,
    "question": "Why is a holistic point of view important in opportunity recognition?",
    "options": [
      "It simplifies tasks by ignoring small details",
      "It allows entrepreneurs to see the full potential and fit of an idea",
      "It helps avoid competition",
      "It guarantees patent protection"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A holistic approach helps entrepreneurs assess an idea’s broader implications and potential."
  },
  {
    "id": 121,
    "question": "Which of the following best describes the internal rate of return (IRR)?",
    "options": [
      "The number of products sold monthly",
      "The return based on external market forces",
      "The profitability measure of a potential investment",
      "The amount of money spent on advertising"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "IRR is a financial metric used to estimate the profitability of a potential investment or venture."
  },
  {
    "id": 122,
    "question": "What makes an idea become an actual opportunity?",
    "options": [
      "The entrepreneur’s enthusiasm",
      "A logo and business name",
      "The presence of market demand and value creation",
      "A social media campaign"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A real opportunity must satisfy a market need and offer value to the customer."
  },
  {
    "id": 123,
    "question": "What is an example of a strategic entry barrier?",
    "options": [
      "High gross margin",
      "Patent protection",
      "Fast employee turnover",
      "Diverse management team"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Patents serve as strategic barriers that prevent competitors from entering a market easily."
  },
  {
    "id": 124,
    "question": "How do governmental programs impact social entrepreneurship?",
    "options": [
      "They discourage innovation",
      "They aim to support but are often insufficient",
      "They replace private initiatives",
      "They remove business taxes"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Government programs can support social entrepreneurs but often lack the scale or funding to fully meet needs."
  },
  {
    "id": 125,
    "question": "Which of the following is NOT a key factor in the success of business opportunities?",
    "options": [
      "Market growth",
      "Gross margin",
      "Consumer behavior",
      "Company logo"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A logo does not determine business opportunity success—market and economic factors do."
  },
  {
    "id": 126,
    "question": "What role does 'experience and contact network' play in opportunity recognition?",
    "options": [
      "It increases product shelf life",
      "It lowers production costs",
      "It supports idea validation and discovery",
      "It removes the need for research"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "A network and experience help entrepreneurs evaluate and refine opportunities more effectively."
  },
  {
    "id": 127,
    "question": "Why is customer experience essential for strategic differentiation?",
    "options": [
      "It makes products cheaper",
      "It ensures low taxes",
      "It can distinguish the business from competitors",
      "It allows unlimited inventory"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Exceptional customer experience can set a company apart in a competitive market."
  },
  {
    "id": 128,
    "question": "What is the purpose of evaluating capital requirements in a new venture?",
    "options": [
      "To set employee salaries",
      "To determine how profitable the logo is",
      "To assess feasibility and investment needs",
      "To hire a social media team"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Knowing capital needs helps in planning funding strategies and assessing the venture’s viability."
  },
  {
    "id": 129,
    "question": "Why are service-related aspects important in manufacturing business opportunities?",
    "options": [
      "They lower taxes",
      "They allow cheaper offshoring",
      "They add value and enhance customer satisfaction",
      "They make logistics easier"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "In manufacturing, services like support and customization add significant value to the end customer."
  },
  {
    "id": 130,
    "question": "What defines the eco-friendly approach in innovation?",
    "options": [
      "Maximizing sales regardless of impact",
      "Using scarce resources intensively",
      "Reducing environmental impact while maintaining viability",
      "Cutting costs by ignoring waste"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Eco-friendly innovation balances sustainability with economic goals, minimizing environmental impact."
  },
  {
    "id": 131,
    "question": "Which of the following is an example of a megatrend that drives new business opportunities?",
    "options": [
      "Office gossip",
      "Changing CEO salaries",
      "Aging population",
      "Temporary price reductions"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "An aging population is a long-term demographic trend that opens opportunities in healthcare, housing, and services."
  },
  {
    "id": 132,
    "question": "What distinguishes an idea from an opportunity?",
    "options": [
      "Ideas require government approval",
      "Opportunities are supported by demand and viability",
      "Ideas are always profitable",
      "Opportunities are purely imaginative"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "An opportunity is a viable, value-creating response to market needs, while an idea may lack real potential."
  },
  {
    "id": 133,
    "question": "How can trends help in identifying opportunities?",
    "options": [
      "They guarantee profit",
      "They eliminate all risks",
      "They highlight emerging needs and preferences",
      "They remove competitors"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Trends reflect changes in consumer behavior and market dynamics that can be leveraged for innovation."
  },
  {
    "id": 134,
    "question": "Which of the following is an example of strategic differentiation?",
    "options": [
      "Competing only on price",
      "Offering identical products as competitors",
      "Providing personalized experiences",
      "Using generic packaging"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Strategic differentiation involves creating value through unique features like personalization."
  },
  {
    "id": 135,
    "question": "What is one major risk of following a business trend without critical analysis?",
    "options": [
      "Too much market attention",
      "Immediate success",
      "Entering a saturated market without value proposition",
      "Excessive customer feedback"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Jumping into a trend blindly may lead to competition without real differentiation or sustainability."
  },
  {
    "id": 136,
    "question": "Why do social entrepreneurship opportunities often require public-private collaboration?",
    "options": [
      "They focus on stock markets",
      "They demand high product turnover",
      "They tackle systemic social issues needing broad support",
      "They only aim to increase luxury services"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Solving complex social problems often requires partnerships between businesses, governments, and NGOs."
  },
  {
    "id": 137,
    "question": "Which of the following is a weak point in evaluating a business opportunity?",
    "options": [
      "Analyzing the market size",
      "Ignoring the competition",
      "Estimating financial returns",
      "Understanding customer needs"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Overlooking competitors can result in underestimating market challenges and risks."
  },
  {
    "id": 138,
    "question": "How can entrepreneurs reduce the uncertainty of new opportunities?",
    "options": [
      "Avoiding any form of data",
      "Testing the market with prototypes or MVPs",
      "Delaying entry until competition decreases",
      "Assuming their idea is always right"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "MVPs and prototyping allow for early feedback and reduce uncertainty before full-scale launch."
  },
  {
    "id": 139,
    "question": "Which of the following statements about opportunity drivers is true?",
    "options": [
      "They are fixed and unchangeable",
      "They emerge from changes in technology, society, or regulation",
      "They are based solely on intuition",
      "They always involve physical products"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Opportunity drivers come from evolving factors like tech, consumer values, and regulatory shifts."
  },
  {
    "id": 140,
    "question": "What is an effective way to assess the potential of a new business idea?",
    "options": [
      "Launching it immediately without planning",
      "Comparing it with existing market needs and trends",
      "Copying a friend’s startup",
      "Relying only on gut feeling"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Matching ideas with market realities helps ensure they are relevant and valuable."
  },
  {
    "id": 141,
    "question": "Which of these is most useful for recognizing hidden opportunities?",
    "options": [
      "Ignoring customer complaints",
      "Tracking customer behavior and feedback",
      "Only following what big brands do",
      "Avoiding innovation"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Customer feedback reveals pain points and unmet needs, leading to innovation."
  },
  {
    "id": 142,
    "question": "In the context of opportunity recognition, what is meant by 'strategic fit'?",
    "options": [
      "Matching the idea with popular celebrities",
      "Aligning the opportunity with business capabilities and goals",
      "Ensuring legal restrictions apply",
      "Hiring employees from similar industries"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Strategic fit ensures the opportunity matches the company’s strengths and long-term vision."
  },
  {
    "id": 143,
    "question": "How does user experience relate to opportunity success?",
    "options": [
      "It creates confusion for customers",
      "It only affects internal operations",
      "It directly influences customer satisfaction and loyalty",
      "It is irrelevant in services"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Positive user experience increases satisfaction, engagement, and retention—key to success."
  },
  {
    "id": 144,
    "question": "Which of the following is a green innovation opportunity?",
    "options": [
      "Developing disposable plastic packaging",
      "Creating reusable water bottles from recycled materials",
      "Opening a coal-powered factory",
      "Promoting single-use batteries"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Green innovation aims to reduce environmental impact through sustainable products or processes."
  },
  {
    "id": 145,
    "question": "What can prevent an entrepreneur from recognizing a good opportunity?",
    "options": [
      "Market research",
      "Personal biases and assumptions",
      "Open communication",
      "Technological insight"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Biases can blind entrepreneurs to valuable ideas or distort evaluation of opportunities."
  },
  {
    "id": 146,
    "question": "What makes trend analysis valuable in entrepreneurship?",
    "options": [
      "It avoids any need for customer contact",
      "It reveals future demand and innovation spaces",
      "It guarantees patent approval",
      "It reduces product cost instantly"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Trends highlight shifting needs and help entrepreneurs predict emerging opportunities."
  },
  {
    "id": 147,
    "question": "Which of the following best defines a viable opportunity?",
    "options": [
      "An idea that sounds exciting",
      "An idea with realistic execution, market need, and value",
      "An idea that was successful 10 years ago",
      "An idea promoted on social media"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Viability includes feasibility, profitability, and a clear value proposition."
  },
  {
    "id": 148,
    "question": "What is a reason to analyze competitors when evaluating a new opportunity?",
    "options": [
      "To copy their marketing slogans",
      "To avoid differentiation",
      "To understand market gaps and positioning",
      "To hire their employees"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Analyzing competitors helps entrepreneurs identify what is missing and how to stand out."
  },
  {
    "id": 149,
    "question": "Which of these statements reflects the reality of manufacturing in today's economy?",
    "options": [
      "It always guarantees high margins",
      "It is becoming more service-oriented and customer-centric",
      "It is outdated and irrelevant",
      "It requires only physical labor"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Modern manufacturing integrates services and customization, focusing on customer value."
  },
  {
    "id": 150,
    "question": "Why is the entrepreneur’s vision important in recognizing opportunities?",
    "options": [
      "It allows them to ignore market trends",
      "It helps them stick to traditional models",
      "It guides innovation and long-term strategic direction",
      "It guarantees fast funding"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.1",
    "explanation": "Vision shapes how entrepreneurs interpret the market and what problems they choose to solve."
  },
  {
    "id": 151,
    "question": "What is the main goal of the Lean Startup method?",
    "options": [
      "To hire the best talent available",
      "To secure early investment",
      "To validate ideas and react accordingly",
      "To maximize short-term profits"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean Startup focuses on testing and validating ideas to avoid investing in something that doesn’t meet customer needs."
  },
  {
    "id": 152,
    "question": "According to the Lean Startup model, what is a startup?",
    "options": [
      "A large corporation entering a new market",
      "A traditional company with stable revenue",
      "A human institution designed to create new products under extreme uncertainty",
      "A nonprofit organization with social goals"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean Startup defines startups as human institutions designed to create value in uncertain conditions."
  },
  {
    "id": 153,
    "question": "What is the correct order of the Lean Startup cycle?",
    "options": [
      "Plan → Execute → Review",
      "Build → Measure → Learn",
      "Create → Promote → Sell",
      "Research → Develop → Test"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "The core cycle of Lean Startup is Build → Measure → Learn."
  },
  {
    "id": 154,
    "question": "What tool is commonly used to summarize a business model in Lean Startup?",
    "options": [
      "SWOT Matrix",
      "PEST Analysis",
      "Business Model Canvas",
      "Financial Plan"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "The Business Model Canvas by Osterwalder is a key tool used in Lean Startup to represent and test assumptions."
  },
  {
    "id": 155,
    "question": "What does the value proposition focus on?",
    "options": [
      "The features of the product",
      "Marketing strategies",
      "The problem it solves or need it satisfies",
      "The distribution process"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "A value proposition is about solving a customer problem or fulfilling a need, not just describing the product."
  },
  {
    "id": 156,
    "question": "What is NOT part of the Lean Startup approach?",
    "options": [
      "Customer interaction",
      "Assumption testing",
      "Predicting exact market behaviors",
      "Minimizing uncertainty"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean Startup avoids predictions; it prefers experimentation and adaptability."
  },
  {
    "id": 157,
    "question": "Which of the following is NOT a step in creating a value proposition?",
    "options": [
      "Define",
      "Comprehend",
      "Prototype",
      "Finance"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "The steps involve understanding the problem, not financing the product."
  },
  {
    "id": 158,
    "question": "In a value proposition map, what are 'pains'?",
    "options": [
      "Competitors in the market",
      "Customer problems to avoid",
      "Negative product reviews",
      "Internal company costs"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "‘Pains’ refer to challenges or frustrations that the customer wants to eliminate."
  },
  {
    "id": 159,
    "question": "What defines a Minimum Viable Product (MVP)?",
    "options": [
      "A finished version ready for sale",
      "An early, high-cost product",
      "A basic version to test assumptions",
      "A free trial with full features"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "An MVP is the simplest product version that allows for testing hypotheses and learning."
  },
  {
    "id": 160,
    "question": "What is the main purpose of a MVP?",
    "options": [
      "Gain media exposure",
      "Attract investors",
      "Avoid building something nobody wants",
      "Boost SEO ranking"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "MVPs reduce risk by confirming if the idea actually solves a real customer problem."
  },
  {
    "id": 161,
    "question": "What does a pivot represent in Lean Startup?",
    "options": [
      "A new marketing campaign",
      "A change in branding",
      "A significant change in business model based on learning",
      "A full product launch"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "A pivot is a strategic change made after testing a hypothesis that didn’t work out."
  },
  {
    "id": 162,
    "question": "Why is customer development essential?",
    "options": [
      "To find investors",
      "To plan advertisements",
      "To understand customers and interact with them",
      "To avoid competition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer development involves direct interaction to understand real needs and problems."
  },
  {
    "id": 163,
    "question": "What is the last phase before moving to the sales stage?",
    "options": [
      "Funding",
      "Building a website",
      "Verify or pivot",
      "Hiring"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "The final phase confirms if the problem/solution fit is valid or requires change."
  },
  {
    "id": 164,
    "question": "What is tested in the problem-solution fit phase?",
    "options": [
      "Revenue models",
      "Manufacturing capacity",
      "Whether the problem is real and the solution fits",
      "Distribution costs"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "This phase ensures that your proposed solution truly addresses a real, existing problem."
  },
  {
    "id": 165,
    "question": "Which of these is NOT a stage in the channel phase?",
    "options": [
      "Awareness",
      "Evaluation",
      "Delivery",
      "Financing"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Financing is not part of the channel phases, which are about delivering the value proposition."
  },
  {
    "id": 166,
    "question": "Why is it helpful to create a value map for each customer segment?",
    "options": [
      "To set higher prices",
      "To copy competitors",
      "To personalize solutions to different pains and gains",
      "To limit customer feedback"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Each segment has unique needs, so a separate value proposition ensures relevance."
  },
  {
    "id": 167,
    "question": "Which component represents the way revenue is generated?",
    "options": [
      "Customer Relationships",
      "Key Partners",
      "Revenue Streams",
      "Value Proposition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Revenue Streams refer to the ways your business earns money from customer segments."
  },
  {
    "id": 168,
    "question": "What is recommended for the cost structure in early stages?",
    "options": [
      "Outsource everything",
      "Hire senior staff",
      "Minimize costs as much as possible",
      "Buy premium office equipment"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Keeping costs low helps avoid large losses in the event of failure or pivoting."
  },
  {
    "id": 169,
    "question": "What trio is essential for managing production and logistics?",
    "options": [
      "Marketing, branding, pricing",
      "Designers, developers, testers",
      "Key Partners, Key Activities, Key Resources",
      "Finance, HR, Legal"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "These three components are operational building blocks of the Lean Canvas."
  },
  {
    "id": 170,
    "question": "What is the purpose of innovation accounting?",
    "options": [
      "Measure financial KPIs only",
      "Track startup growth using traditional methods",
      "Evaluate behavior of innovation elements and track learning",
      "File tax returns efficiently"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Innovation accounting is used to track learning and experimentation outcomes."
  },
  {
    "id": 171,
    "question": "What does a 'gain' refer to in the value proposition map?",
    "options": [
      "Company profit margins",
      "Customer positive outcomes or benefits",
      "Marketing channel growth",
      "Cost reduction strategies"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Gains are the benefits or positive results customers expect or would be surprised by."
  },
  {
    "id": 172,
    "question": "What is a ‘customer segment’ in the Business Model Canvas?",
    "options": [
      "A geographical market",
      "The group of customers your business serves",
      "Your social media audience",
      "A company’s internal team"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer segments represent the different groups of people or organizations a business targets."
  },
  {
    "id": 173,
    "question": "Which Lean Startup concept emphasizes small, quick experiments?",
    "options": [
      "Agile scaling",
      "Rapid prototyping",
      "Brand positioning",
      "Market saturation"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Rapid prototyping involves quickly building and testing small-scale versions of products."
  },
  {
    "id": 174,
    "question": "Which of the following is a reason to pivot?",
    "options": [
      "Team expansion",
      "Too many customers",
      "Customer feedback contradicts initial assumptions",
      "Perfect product-market fit"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "A pivot happens when learning from customers shows the original direction isn’t optimal."
  },
  {
    "id": 175,
    "question": "What distinguishes a lean startup from a traditional startup?",
    "options": [
      "More investors",
      "Fewer employees",
      "Focus on experimentation and learning",
      "Better infrastructure"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean startups focus on learning through iteration and feedback rather than executing a fixed plan."
  },
  {
    "id": 176,
    "question": "In Lean Startup, what is validated learning?",
    "options": [
      "Training new employees",
      "Learning from competitors’ success",
      "Learning backed by data from real customer behavior",
      "Studying academic research"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Validated learning comes from experiments and customer interaction, not assumptions."
  },
  {
    "id": 177,
    "question": "Why do Lean Startups prefer early launch of MVPs?",
    "options": [
      "To look professional",
      "To beat competition",
      "To gain early feedback and adjust quickly",
      "To secure media attention"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Launching early helps test hypotheses and adjust before too much is invested."
  },
  {
    "id": 178,
    "question": "What is a key difference between a prototype and a MVP?",
    "options": [
      "MVP is for internal use only",
      "Prototype is launched before MVP",
      "MVP is meant for real user feedback",
      "Prototype is usually more expensive"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "MVPs are live and used by real users to gather meaningful feedback, unlike prototypes."
  },
  {
    "id": 179,
    "question": "What is one of the nine building blocks of the Business Model Canvas?",
    "options": [
      "Vision Statement",
      "Product Design",
      "Customer Relationships",
      "Annual Revenue"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer Relationships define how a startup interacts with its customer base."
  },
  {
    "id": 180,
    "question": "Which of these statements best describes the 'problem-solution fit'?",
    "options": [
      "Having the most features in your product",
      "Matching customer jobs with gains and pain relievers",
      "Maximizing advertising reach",
      "Achieving operational efficiency"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Problem-solution fit is about aligning your solution with the customer's real problems and goals."
  },
  {
    "id": 181,
    "question": "What is a 'pivot or persevere' decision based on?",
    "options": [
      "The CEO’s intuition",
      "Board approval",
      "Customer data and MVP feedback",
      "The size of your team"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "This decision depends on whether feedback shows the idea works or needs to change."
  },
  {
    "id": 182,
    "question": "What are 'early adopters'?",
    "options": [
      "Customers who only buy discounted products",
      "People who copy trends",
      "The first group of users willing to try a new product",
      "Retailers who sell your product"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Early adopters are key to testing and refining new solutions in real market conditions."
  },
  {
    "id": 183,
    "question": "Which of these activities best supports customer discovery?",
    "options": [
      "Email marketing",
      "Running paid ads",
      "Conducting interviews with potential users",
      "Developing software architecture"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer interviews provide insights into real needs and validate assumptions."
  },
  {
    "id": 184,
    "question": "What is the 'Build' step of the Lean cycle focused on?",
    "options": [
      "Designing brand visuals",
      "Launching a product for profit",
      "Creating something to test a hypothesis",
      "Scaling operations"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "You build something specifically to test assumptions with minimal resources."
  },
  {
    "id": 185,
    "question": "Which aspect of a startup does the Lean Canvas replace?",
    "options": [
      "Marketing plan",
      "Sales forecast",
      "Traditional business plan",
      "Product roadmap"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean Canvas is a one-page alternative to traditional business plans, focused on validation."
  },
  {
    "id": 186,
    "question": "What is meant by 'achieving product-market fit'?",
    "options": [
      "The product matches the customer's needs and market demand",
      "The product is technically perfect",
      "The brand is well known",
      "The team has grown enough"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Product-market fit means your product satisfies a strong market need effectively."
  },
  {
    "id": 187,
    "question": "What role does hypothesis testing play in Lean Startup?",
    "options": [
      "It's only used for marketing strategies",
      "It reduces the need for customer interaction",
      "It allows startups to validate assumptions before scaling",
      "It guarantees success"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Testing hypotheses helps avoid investing in unproven ideas too early."
  },
  {
    "id": 188,
    "question": "What is a 'key metric' in Lean Startup terms?",
    "options": [
      "A vanity number",
      "A number your investors want",
      "A data point tied directly to learning and growth",
      "A financial projection"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Key metrics must inform decisions and validate core assumptions, not just look good."
  },
  {
    "id": 189,
    "question": "Why is 'learning' prioritized over 'execution' in Lean Startups?",
    "options": [
      "It’s cheaper",
      "Execution without validation leads to waste",
      "Investors expect it",
      "It increases job satisfaction"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Execution based on wrong assumptions wastes time and money, so validated learning is essential."
  },
  {
    "id": 190,
    "question": "What is the best way to know if your MVP works?",
    "options": [
      "Team consensus",
      "Positive online comments",
      "User behavior and data",
      "Media coverage"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Actual user behavior is the most reliable indicator of whether your MVP solves the problem."
  },
    {
    "id": 191,
    "question": "What is a ‘pain reliever’ in the value proposition canvas?",
    "options": [
      "A medical product category",
      "Something that reduces or eliminates a customer’s problems",
      "A cheaper version of a product",
      "A feature that adds aesthetic appeal"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Pain relievers describe how your product reduces customer frustrations or obstacles."
  },
  {
    "id": 192,
    "question": "Which of these is an example of a Minimum Viable Product (MVP)?",
    "options": [
      "A full-feature app launched in all markets",
      "A simple landing page to test interest",
      "A 50-page business plan",
      "A patent registration"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "A landing page can test user interest before investing in full development."
  },
  {
    "id": 193,
    "question": "What is the first step in the Build-Measure-Learn cycle?",
    "options": [
      "Measure customer satisfaction",
      "Develop a business plan",
      "Build an experiment or MVP",
      "Create marketing campaigns"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "The cycle starts with building a testable version of your idea to gather insights."
  },
  {
    "id": 194,
    "question": "Which activity best helps identify real customer problems?",
    "options": [
      "Running TV ads",
      "Creating a product roadmap",
      "Talking directly with users",
      "Copying competitor strategies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer conversations help uncover authentic pain points and unmet needs."
  },
  {
    "id": 195,
    "question": "What does the term 'pivot' mean in Lean Startup?",
    "options": [
      "Abandoning the business",
      "Changing business legal structure",
      "Shifting strategy based on validated learning",
      "Hiring new team members"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "A pivot is a structured course correction to test a new approach."
  },
  {
    "id": 196,
    "question": "Why is customer feedback essential during product development?",
    "options": [
      "To satisfy investors",
      "To confirm product-market fit and improve the offer",
      "To make your product cheaper",
      "To avoid legal risks"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Customer feedback validates if the product truly addresses a real problem or need."
  },
  {
    "id": 197,
    "question": "Which is a characteristic of a Lean approach to entrepreneurship?",
    "options": [
      "Spending months in stealth mode",
      "Avoiding customer interaction until product launch",
      "Iterating quickly based on real-world data",
      "Focusing only on profit margins"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Lean startups test and adjust rapidly based on real user feedback and metrics."
  },
  {
    "id": 198,
    "question": "How can startups reduce the risk of product failure?",
    "options": [
      "Focus on scaling early",
      "Launch in multiple countries",
      "Validate assumptions early with real users",
      "Hire an expensive marketing team"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Validating early ensures you're building something people actually want."
  },
  {
    "id": 199,
    "question": "Which component of the Lean Canvas describes how the startup earns revenue?",
    "options": [
      "Key Metrics",
      "Channels",
      "Revenue Streams",
      "Customer Segments"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Revenue Streams detail how the business captures value from customers."
  },
  {
    "id": 200,
    "question": "Which metric would best indicate traction in a Lean Startup?",
    "options": [
      "Number of social media followers",
      "Website design awards",
      "Customer retention rate",
      "Number of employees"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "2.2",
    "explanation": "Retention shows that users find real value and keep using the product."
  },
  {
    "id": 201,
    "question": "What is the main purpose of a business plan?",
    "options": [
      "To set prices for products",
      "To explore global market trends",
      "To attract key stakeholders and study business aspects",
      "To measure employee satisfaction"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan aims to study various aspects of the business and specific external factors to attract stakeholders."
  },
  {
    "id": 202,
    "question": "Which of the following best describes a business plan?",
    "options": [
      "A list of legal requirements",
      "A one-time document never to be updated",
      "A live and convincing selling document about the company",
      "An academic report with historical data"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan is a live, convincing document used to present the company and attract interest."
  },
  {
    "id": 203,
    "question": "Why is a business plan important for a company?",
    "options": [
      "It reduces the number of employees needed",
      "It allows the business to avoid taxes",
      "It helps raise funds and supports growth by identifying risks and setting strategies",
      "It ensures competitors stay out of the market"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan is essential for strategic planning, attracting investment, risk detection, and performance comparison."
  },
  {
    "id": 204,
    "question": "Who among the following is part of the external group interested in a business plan?",
    "options": [
      "Managers",
      "Employees",
      "Investors and banks",
      "Consultants and interns"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "External stakeholders like investors and banks use the business plan to evaluate the business's potential."
  },
  {
    "id": 205,
    "question": "Which section of a formal business plan contains the vision and mission statements?",
    "options": [
      "Cover Page",
      "Executive Summary",
      "Table of Contents",
      "Financial Projections"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The Executive Summary provides a concise overview, including the company’s vision and mission."
  },
  {
    "id": 206,
    "question": "What does a mission statement primarily clarify?",
    "options": [
      "Company profits",
      "Long-term expenses",
      "Purpose, customer benefits, and competitive differences",
      "Legal liabilities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A mission clarifies the company’s context, benefit, target customers, and point of differentiation."
  },
  {
    "id": 207,
    "question": "What does the gross margin indicate in a business plan?",
    "options": [
      "The profit after tax",
      "The portion of revenue retained after direct costs",
      "Total production volume",
      "Company’s market value"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Gross margin is the proportion of revenue remaining after subtracting direct production costs."
  },
  {
    "id": 208,
    "question": "Which equation best describes the break-even point?",
    "options": [
      "Fixed costs ÷ Variable costs",
      "(Selling price - Variable cost) ÷ Fixed costs",
      "Fixed costs ÷ (Selling price - Variable cost)",
      "Revenue - Expenses"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Break-even point is calculated as Fixed Costs divided by the Contribution Margin (Selling price - Variable cost)."
  },
  {
    "id": 209,
    "question": "What kind of information is included in the full business plan section?",
    "options": [
      "Only the company's legal structure",
      "Just financial data",
      "Company description, market and industry analysis, management, and financial projections",
      "Advertising scripts and slogans"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The full business plan includes comprehensive data on all key areas such as description, market, strategy, and finances."
  },
  {
    "id": 210,
    "question": "What is the main function of the Operating Income section in a business plan?",
    "options": [
      "To detail fixed costs only",
      "To reflect profitability from core operations",
      "To calculate net revenue",
      "To list customer reviews"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Operating income shows the profit from core business operations, excluding non-operational factors like taxes."
  },
  {
    "id": 211,
    "question": "Which of the following is a reason for creating a business plan?",
    "options": [
      "To recruit low-cost labor",
      "To outline the company's position and define the direction of the business",
      "To reduce tax burdens",
      "To register trademarks"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan defines the direction of the company and outlines its current and future position."
  },
  {
    "id": 212,
    "question": "What is an internal reason for writing a business plan?",
    "options": [
      "To secure loans from banks",
      "To determine salary brackets",
      "To define future strategy and manage risk",
      "To comply with tax laws"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Internally, a business plan helps define strategy, detect risks, and compare results with expectations."
  },
  {
    "id": 213,
    "question": "Which of the following is considered an external reason for developing a business plan?",
    "options": [
      "Setting internal KPIs",
      "Attracting new talent",
      "Presenting the company to banks or investors",
      "Calculating tax returns"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Externally, a business plan is used to present the company to stakeholders such as banks or investors."
  },
  {
    "id": 214,
    "question": "How is a business plan described in terms of its lifecycle?",
    "options": [
      "It should be discarded after one year",
      "It is static and doesn't change",
      "It is a live document that evolves",
      "It is prepared only for legal compliance"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The business plan is a live document, meaning it evolves with the business and is updated regularly."
  },
  {
    "id": 215,
    "question": "Which of the following sections is included in a full business plan?",
    "options": [
      "Weather reports",
      "Company description and market analysis",
      "Personal resumes",
      "Monthly calendars"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A full business plan includes the company description and market/industry analysis."
  },
  {
    "id": 216,
    "question": "What does the SWOT analysis in a business plan examine?",
    "options": [
      "Only strengths and threats",
      "Only financial trends",
      "Strengths, weaknesses, opportunities, and threats",
      "Just internal HR capabilities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "SWOT stands for strengths, weaknesses, opportunities, and threats."
  },
  {
    "id": 217,
    "question": "The financial plan in a business plan typically includes:",
    "options": [
      "Staff performance reviews",
      "Balance sheets and cash flow forecasts",
      "Personal expense reports",
      "Competitor reviews"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The financial section includes balance sheets, income statements, and cash flow projections."
  },
  {
    "id": 218,
    "question": "What is the purpose of the break-even analysis in a business plan?",
    "options": [
      "To analyze staff productivity",
      "To determine when revenue will equal expenses",
      "To plan advertising budgets",
      "To compare competitor prices"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Break-even analysis determines the point at which total income equals total costs."
  },
  {
    "id": 219,
    "question": "What part of the business plan outlines what the company does, for whom, and what makes it unique?",
    "options": [
      "Financial Plan",
      "Marketing Strategy",
      "Mission Statement",
      "SWOT Analysis"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The mission statement defines the business purpose, target customers, and point of difference."
  },
  {
    "id": 220,
    "question": "What does the vision statement in a business plan usually express?",
    "options": [
      "The daily routine of workers",
      "Tax obligations of the firm",
      "The long-term aspiration of the company",
      "The market size and trends"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The vision is the long-term aspiration of the business and guides future development."
  },
  {
    "id": 221,
    "question": "The 'Executive Summary' of a business plan is:",
    "options": [
      "Written only for accountants",
      "A brief overview of the entire business plan",
      "Focused only on product pricing",
      "The company's employment contract"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The Executive Summary gives a concise overview of the plan, including vision, mission, and key details."
  },
  {
    "id": 222,
    "question": "Which of the following best defines 'Operating Income'?",
    "options": [
      "Income after taxes and interest",
      "Gross sales",
      "Profit from core business operations",
      "Cash balance in bank"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Operating income refers to earnings from the company's main operations, before taxes and interest."
  },
  {
    "id": 223,
    "question": "What does the term 'gross margin' refer to?",
    "options": [
      "The cost of salaries",
      "The value of machinery",
      "Revenue minus direct costs",
      "Net profit after all expenses"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Gross margin represents the income retained after covering the direct costs of production."
  },
  {
    "id": 224,
    "question": "A business plan should be written in a way that is:",
    "options": [
      "Highly technical and complex",
      "Simple enough for everyone to understand",
      "Full of marketing jargon",
      "Only readable by lawyers"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan should be clear and concise to be understood by all stakeholders."
  },
  {
    "id": 225,
    "question": "Which of the following documents is **not** typically part of a formal business plan?",
    "options": [
      "Vision and mission statements",
      "Cash flow forecasts",
      "Weather conditions",
      "Break-even analysis"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Weather conditions are not relevant to the standard structure of a business plan."
  },
  {
    "id": 226,
    "question": "What is the purpose of defining 'Key Success Factors' in a business plan?",
    "options": [
      "To satisfy tax authorities",
      "To identify critical elements for success",
      "To outline government regulations",
      "To describe employee relationships"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Key success factors highlight essential elements that the company must address to succeed."
  },
  {
    "id": 227,
    "question": "Which of these is a typical question answered by a business plan?",
    "options": [
      "What will we name our pet mascot?",
      "Where should we post social media updates?",
      "How will the company achieve profitability?",
      "When should employees take vacations?"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan explains how a company plans to be profitable and sustainable."
  },
  {
    "id": 228,
    "question": "Which metric helps determine the pricing strategy of a company?",
    "options": [
      "Break-even point",
      "Cash flow",
      "Net salary",
      "Tax rate"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The break-even point influences the pricing needed to cover costs and generate profit."
  },
  {
    "id": 229,
    "question": "In the context of a business plan, who are 'key stakeholders'?",
    "options": [
      "People who follow the company on social media",
      "Individuals or groups with an interest in the business's success",
      "Only the CEO and founders",
      "Employees who work overtime"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Stakeholders include anyone affected by or interested in the company, such as investors, banks, and customers."
  },
  {
    "id": 230,
    "question": "What is the best way to use a business plan over time?",
    "options": [
      "Use it only once at launch",
      "Update it annually and adapt it as conditions change",
      "Lock it in a drawer for legal safety",
      "Only refer to it during bankruptcy"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan is a dynamic tool that should be reviewed and updated regularly as the business evolves."
  },
   {
    "id": 231,
    "question": "What is typically the first section in a business plan?",
    "options": [
      "SWOT analysis",
      "Financial statements",
      "Executive summary",
      "Marketing plan"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The Executive Summary is usually the first section and provides a concise overview of the business plan."
  },
  {
    "id": 232,
    "question": "Why is the company description important in a business plan?",
    "options": [
      "It lists all suppliers",
      "It defines the business, its goals, and the problems it aims to solve",
      "It shows advertising results",
      "It describes employee complaints"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The company description provides a clear idea of what the business does, its objectives, and its market."
  },
  {
    "id": 233,
    "question": "The marketing and sales plan in a business plan focuses on:",
    "options": [
      "Employee salaries",
      "Product development deadlines",
      "How the business will attract and retain customers",
      "Tax filing procedures"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "This section outlines strategies for market entry, pricing, promotion, and sales."
  },
  {
    "id": 234,
    "question": "What should the operations plan of a business describe?",
    "options": [
      "Tax deductions",
      "The daily functioning and logistics of the company",
      "Celebrity endorsements",
      "Bank interest rates"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The operations plan covers the production process, location, facilities, equipment, and logistics."
  },
  {
    "id": 235,
    "question": "Which section of the business plan highlights the background and roles of key team members?",
    "options": [
      "SWOT analysis",
      "Company description",
      "Management and organization",
      "Break-even analysis"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "This section identifies the people behind the business and their responsibilities."
  },
  {
    "id": 236,
    "question": "Which of the following would likely be included in the appendix of a business plan?",
    "options": [
      "Vision statement",
      "Market trends",
      "Resumes and legal documents",
      "Executive summary"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The appendix includes supporting documents such as CVs, permits, and detailed data tables."
  },
  {
    "id": 237,
    "question": "What is the purpose of competitor analysis in a business plan?",
    "options": [
      "To avoid all competition",
      "To criticize other companies",
      "To understand market position and differentiation",
      "To copy successful ideas"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Competitor analysis helps identify gaps in the market and position the business competitively."
  },
  {
    "id": 238,
    "question": "In a business plan, what is a 'target market'?",
    "options": [
      "All consumers globally",
      "The group of people most likely to buy the product or service",
      "Employees of the business",
      "Shareholders only"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The target market refers to the specific segment of consumers the business aims to serve."
  },
  {
    "id": 239,
    "question": "A value proposition is:",
    "options": [
      "The cost of production",
      "A legal business name",
      "A clear statement of benefits offered to customers",
      "A tax filing method"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "It explains how a product or service solves a problem and why it’s better than alternatives."
  },
  {
    "id": 240,
    "question": "The business plan helps in setting:",
    "options": [
      "Vacation schedules",
      "Tax rates",
      "Strategic goals and monitoring mechanisms",
      "Employee punishments"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "It defines strategic goals and provides tools to monitor progress toward them."
  },
  {
    "id": 241,
    "question": "What is the function of the financial projections section?",
    "options": [
      "To show marketing trends",
      "To visualize expected revenues and expenses",
      "To calculate taxes",
      "To explain employment policies"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "This section outlines anticipated financial performance, including income, expenses, and growth."
  },
  {
    "id": 242,
    "question": "In a business plan, ROI stands for:",
    "options": [
      "Rate of Income",
      "Return on Investment",
      "Revenue Over Income",
      "Ratio of Innovation"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "ROI measures the profitability of investments relative to their cost."
  },
  {
    "id": 243,
    "question": "How often should a business plan be reviewed?",
    "options": [
      "Only at the start",
      "Every 10 years",
      "Only during crises",
      "Regularly to reflect changes"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "A business plan should be updated regularly to reflect market or internal changes."
  },
  {
    "id": 244,
    "question": "Which of the following is **not** a typical element of the market analysis section?",
    "options": [
      "Industry description",
      "Target customer profile",
      "Employee reviews",
      "Competitive landscape"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Employee reviews are not part of market analysis; it focuses on external conditions."
  },
  {
    "id": 245,
    "question": "Why is the organizational structure included in a business plan?",
    "options": [
      "To impress investors with the number of employees",
      "To show vacation policies",
      "To clarify who is responsible for what",
      "To display office locations"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "It defines roles and responsibilities, which is crucial for execution and accountability."
  },
  {
    "id": 246,
    "question": "How does a business plan support communication?",
    "options": [
      "By providing email addresses",
      "By outlining technical jargon",
      "By summarizing the business clearly for all stakeholders",
      "By describing entertainment options"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "It helps communicate the business idea clearly to potential partners, employees, and investors."
  },
  {
    "id": 247,
    "question": "When presenting a business plan to investors, what is especially important?",
    "options": [
      "Highlighting hobbies of employees",
      "Explaining tax returns in detail",
      "Demonstrating profitability and growth potential",
      "Showing office decorations"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "Investors want to understand the business’s potential to generate returns."
  },
  {
    "id": 248,
    "question": "Which element of a business plan helps mitigate risks?",
    "options": [
      "SWOT analysis",
      "Appendix",
      "Mission statement",
      "Vision statement"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "SWOT analysis identifies internal and external risks and opportunities."
  },
  {
    "id": 249,
    "question": "How does a business plan aid decision-making?",
    "options": [
      "It acts as a legal requirement",
      "It outlines structured goals and strategies",
      "It replaces contracts",
      "It controls employee behavior"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "With clear strategies and data, the business plan guides better decision-making."
  },
  {
    "id": 250,
    "question": "Which part of a business plan would likely include graphs or charts?",
    "options": [
      "Executive summary",
      "Company background",
      "Financial plan",
      "Mission statement"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.1",
    "explanation": "The financial plan often includes visual elements like charts to explain projections."
  },
  {
    "id": 251,
    "subject": "economy",
    "topic": "3.2",
    "question": "What is the primary goal of the marketing section in a formal business plan?",
    "options": [
      "To list the available suppliers and raw materials.",
      "To analyze price, promotion, distribution, and sales strategies.",
      "To create a full organizational chart of the business.",
      "To identify the legal responsibilities of board members."
    ],
    "correctAnswer": 1,
    "explanation": "The marketing section of a formal business plan is focused on analyzing price, promotion, distribution, and sales to define how the company will attract and retain customers."
  },
  {
    "id": 252,
    "subject": "economy",
    "topic": "3.2",
    "question": "What is a 'buyer persona' in the context of a business plan?",
    "options": [
      "A legal representative of the company's investors.",
      "A type of distribution strategy.",
      "A fictional, generalized representation of ideal customers.",
      "A tool used to calculate financial ratios."
    ],
    "correctAnswer": 2,
    "explanation": "Buyer personas are fictional profiles that help businesses understand and target their ideal customers more effectively."
  },
  {
    "id": 253,
    "subject": "economy",
    "topic": "3.2",
    "question": "What is the function of the 'pro forma income statement'?",
    "options": [
      "To display the company's organizational structure.",
      "To explain how products will be distributed.",
      "To show projected sales, profits, and margins.",
      "To summarize the company’s legal risks."
    ],
    "correctAnswer": 2,
    "explanation": "The pro forma income statement provides an economic projection of the business, including expected sales, profits, and margins."
  },
  {
    "id": 254,
    "subject": "economy",
    "topic": "3.2",
    "question": "Why are 'negative buyer personas' useful in a business plan?",
    "options": [
      "They help determine employee wages.",
      "They assist in identifying markets to avoid.",
      "They reveal the most profitable customer segments.",
      "They highlight the company's equity structure."
    ],
    "correctAnswer": 1,
    "explanation": "Negative buyer personas represent the types of customers that are not ideal for the business due to reasons like lack of budget or low retention."
  },
  {
    "id": 255,
    "subject": "economy",
    "topic": "3.2",
    "question": "Which of the following best describes the 'investment proposal' section of a business plan?",
    "options": [
      "A record of the company's past expenditures.",
      "A breakdown of day-to-day operations.",
      "A description of financing needs, usage, risks, and repayment schedule.",
      "A chart of the product’s life cycle."
    ],
    "correctAnswer": 2,
    "explanation": "The investment proposal outlines the required funding, its planned usage, risk assessment, and repayment plan."
  },
  {
    "id": 256,
    "subject": "economy",
    "topic": "3.2",
    "question": "What is the role of the 'pro forma cash flow statement'?",
    "options": [
      "To define the company’s tax obligations.",
      "To measure the business’s productivity.",
      "To show when money will be available to pay debts.",
      "To assess employee satisfaction."
    ],
    "correctAnswer": "To show when money will be available to pay debts.",
    "explanation": "The pro forma cash flow statement is critical because it shows the company's expected liquidity, helping assess the feasibility of debt payments."
  },
  {
    "id": 257,
    "subject": "economy",
    "topic": "3.2",
    "question": "Which of the following is NOT typically included in the full business plan?",
    "options": [
      "Company brand and customer base.",
      "Staff responsibilities and educational background.",
      "Daily emotional state of employees.",
      "Pro forma financial statements."
    ],
    "correctAnswer": 2,
    "explanation": "While staff responsibilities and qualifications are included, personal emotional states are not relevant to the structure of a business plan."
  },
  {
    "id": 258,
    "subject": "economy",
    "topic": "3.2",
    "question": "What is a common investor preference when presenting a business plan?",
    "options": [
      "A long technical document with formulas.",
      "A brief oral presentation supported by visuals.",
      "A product demonstration video only.",
      "A silent slideshow with text-heavy slides."
    ],
    "correctAnswer": 1,
    "explanation": "Investors often prefer a concise oral presentation with graphic support before reading the full business plan."
  },
  {
    "id": 259,
    "subject": "economy",
    "topic": "3.2",
    "question": "Which of the following factors should be considered when selecting a business location?",
    "options": [
      "Local folklore and traditions.",
      "Proximity to customers and suppliers, wage rates, and infrastructure.",
      "Personal hobbies of the founder.",
      "Color of nearby buildings."
    ],
    "correctAnswer": 1,
    "explanation": "Business location should be strategic and consider factors like access to customers, suppliers, infrastructure, and cost-effective labor."
  },
  {
    "id": 260,
    "subject": "economy",
    "topic": "3.2",
    "question": "Which financial document is most consulted in a business plan?",
    "options": [
      "Pro forma balance sheet",
      "Pro forma income statement",
      "Pro forma cash flow statement",
      "Investment proposal"
    ],
    "correctAnswer": 2,
    "explanation": "The pro forma cash flow statement is crucial because it indicates when the business will have funds available to meet financial obligations."
  },
   {
    "id": 261,
    "question": "What is the main purpose of creating buyer personas?",
    "options": ["To find legal loopholes", "To better understand your ideal customers", "To increase manufacturing efficiency", "To reduce supplier costs"],
    "correctAnswer": 1,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "Buyer personas help tailor content and marketing strategies to meet the specific needs of different customer segments."
  },
  {
    "id": 262,
    "question": "What type of persona represents customers you do NOT want to target?",
    "options": ["Positive personas", "Support personas", "Buyer avatars", "Negative buyer personas"],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Negative buyer personas represent people who are unlikely to be profitable or are too expensive to acquire."
  },
  {
    "id": 263,
    "question": "Which of the following is NOT a common reason to exclude someone using a negative buyer persona?",
    "options": ["They are highly educated", "They don't have the budget", "They are uninterested", "They are hard to retain"],
    "correctAnswer": 0,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "Education level alone is not a common reason to exclude a customer unless it affects product fit."
  },
  {
    "id": 264,
    "question": "What should the Marketing section of a business plan include?",
    "options": ["Company mission only", "Product dimensions", "Price, promotion, sales and distribution analysis", "Daily operational schedule"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The marketing section outlines the company's strategy in pricing, promoting, and selling its products or services."
  },
  {
    "id": 265,
    "question": "Why is a sales cycle important in a business plan?",
    "options": ["To determine legal obligations", "To explain advertising costs", "To explain the time it takes to close a sale", "To set packaging standards"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The sales cycle illustrates how long it takes to convert a lead into a paying customer, essential for revenue planning."
  },
  {
    "id": 266,
    "question": "What type of costs should advertising and promotion be included under?",
    "options": ["Variable costs", "Capital expenditures", "General indirect costs", "Fixed assets"],
    "correctAnswer": 2,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "Marketing expenses like advertising and promotion are indirect costs not tied directly to product manufacturing."
  },
  {
    "id": 267,
    "question": "What does the organizational chart in a business plan show?",
    "options": ["The advertising schedule", "The legal liabilities", "The company hierarchy", "The customer satisfaction levels"],
    "correctAnswer": 2,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "An organization chart illustrates the structure, positions, and responsibilities within the company."
  },
  {
    "id": 268,
    "question": "What is the purpose of the 'pro forma' income statement?",
    "options": ["To record past financial transactions", "To show future expected sales and profits", "To estimate tax deductions", "To outline government grants"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The pro forma income statement is a financial forecast showing expected revenues and expenses."
  },
  {
    "id": 269,
    "question": "Which ratio is NOT typically included in a pro forma income statement analysis?",
    "options": ["ROE", "ROA", "ROS", "LTV"],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "LTV (Customer Lifetime Value) is a marketing metric, not part of standard financial ratio analysis in income statements."
  },
  {
    "id": 270,
    "question": "What does the pro forma balance sheet help determine?",
    "options": ["Marketing strategy", "Asset financing", "Hiring policies", "Sales commissions"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The pro forma balance sheet indicates what assets are needed and how they will be financed."
  },
  {
    "id": 271,
    "question": "Why is the pro forma cash flow statement critical?",
    "options": ["It shows the number of customers acquired", "It calculates income tax", "It shows when the business can pay its debts", "It determines the equity structure"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The cash flow statement highlights liquidity and the company's ability to meet short-term obligations."
  },
  {
    "id": 272,
    "question": "What should an investment proposal include?",
    "options": ["Employee preferences", "Schedule of product features", "Use of funds and repayment plan", "Product descriptions only"],
    "correctAnswer": 2,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "An investment proposal outlines how the capital will be used, repayment terms, and key milestones."
  },
  {
    "id": 273,
    "question": "What does the sustainability section address?",
    "options": ["Operational errors", "Customer loyalty programs", "Social, economic, and environmental impact", "Office design layout"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "This section assesses the company’s responsibility and opportunities for positive impact."
  },
  {
    "id": 274,
    "question": "What is the purpose of the Appendix in a business plan?",
    "options": ["To replace the executive summary", "To include unrelated business topics", "To provide additional support material", "To outline HR policies"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The Appendix includes supporting evidence, charts, or documents that reinforce other sections."
  },
  {
    "id": 275,
    "question": "What is one of the main goals of the Operational Plan?",
    "options": ["To define customer satisfaction goals", "To determine CEO compensation", "To explain how the business will be run", "To set government lobbying policies"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The operational plan provides detailed insights into how the business will function daily."
  },
  {
    "id": 276,
    "question": "Which of the following is typically included in a startup business plan?",
    "options": ["Daily timecards", "Company brand and financial info", "Complete production log", "Legislative proposals"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "A startup plan includes essentials like branding, customers, team, finances, and available cash."
  },
  {
    "id": 277,
    "question": "When presenting to investors, what type of presentation is usually preferred?",
    "options": ["Long legal document", "Short oral pitch with graphs", "Full market research report", "Technical specifications"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Investors prefer concise pitches with visuals that highlight the opportunity clearly and quickly."
  },
  {
    "id": 278,
    "question": "What is NOT recommended in a pitch presentation?",
    "options": ["Sharp slides", "Smooth delivery", "Overloaded text", "Showing enthusiasm"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Effective presentations avoid clutter and focus on key points with clean, readable visuals."
  },
  {
    "id": 279,
    "question": "Which of the 5 C's evaluates whether the entrepreneur can repay a loan?",
    "options": ["Character", "Collateral", "Capacity", "Conditions"],
    "correctAnswer": 2,
    "subject": "economy",
   "topic": "3.2",
    "explanation": "Capacity refers to the entrepreneur's ability, in financial terms, to repay a loan."
  },
  {
    "id": 280,
    "question": "Which factor is NOT directly related to choosing a business location?",
    "options": ["Digital connectivity", "Weather conditions", "Wage rates", "Marketing strategy"],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "While marketing is important, factors like proximity to customers and infrastructure directly affect location decisions."
  },
    {
    "id": 281,
    "question": "Why might a business use scenario planning in its financial forecasting?",
    "options": ["To avoid paying taxes", "To determine branding guidelines", "To prepare for multiple future conditions", "To define mission and vision"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Scenario planning allows a company to forecast different financial outcomes based on varying economic or market conditions."
  },
  {
    "id": 282,
    "question": "What is the primary risk of overestimating projected sales in a pro forma income statement?",
    "options": ["Increased competition", "Unrealistic budgeting and poor cash flow management", "Improved investor confidence", "Reduced legal obligations"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Overestimating sales can result in poor budgeting, overhiring, or overspending, leading to cash flow problems."
  },
  {
    "id": 283,
    "question": "How does a business plan address operational scalability?",
    "options": ["By listing tax obligations", "By showing how operations can expand without proportionate cost increases", "By reducing the marketing budget", "By limiting the product line"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Operational scalability describes the ability to grow operations efficiently, which is key to investor interest."
  },
  {
    "id": 284,
    "question": "In financial forecasting, what does 'burn rate' refer to?",
    "options": ["Interest rates charged on loans", "Rate of customer churn", "Rate at which a startup spends its capital", "Amount of tax owed per quarter"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Burn rate is the pace at which a startup uses its cash before generating income, critical for planning runway."
  },
  {
    "id": 285,
    "question": "Which of the following best illustrates vertical integration in an operational plan?",
    "options": ["Opening a retail chain to sell company-made products", "Outsourcing all marketing tasks", "Buying ads from third-party platforms", "Licensing products to foreign markets"],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Vertical integration means controlling more steps in the supply chain, like manufacturing and distribution."
  },
  {
    "id": 286,
    "question": "Why might a startup choose to include a break-even analysis in its business plan?",
    "options": ["To compare employee performance", "To determine when revenue will equal total costs", "To evaluate branding effectiveness", "To estimate long-term tax savings"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "A break-even analysis identifies the point where total revenue equals total expenses, critical for financial planning."
  },
  {
    "id": 287,
    "question": "Which method would most accurately evaluate an entrepreneur’s readiness for expansion?",
    "options": ["Analyzing the equity ratio", "Assessing brand popularity", "Conducting a SWOT and capacity analysis", "Monitoring competitor pricing"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Readiness for growth is evaluated through internal capability assessments like SWOT and capacity analysis."
  },
  {
    "id": 288,
    "question": "What is the role of a contingency plan in a formal business plan?",
    "options": ["It defines the executive team", "It outlines optional HR policies", "It addresses potential risks and alternative responses", "It lists fixed and variable costs"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "A contingency plan outlines how a business will respond to unexpected disruptions or market shifts."
  },
  {
    "id": 289,
    "question": "Which financial document would an investor examine to verify how profits are reinvested?",
    "options": ["Cash flow statement", "Balance sheet", "Pro forma income statement", "Statement of retained earnings"],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "The statement of retained earnings shows how profits are reinvested or distributed as dividends."
  },
  {
    "id": 290,
    "question": "What does sensitivity analysis help identify in a financial projection?",
    "options": ["Which team member is underperforming", "How profits vary with changes in key variables", "Legal risks from product liability", "How to reduce HR costs"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Sensitivity analysis tests how changes in variables like costs or sales affect financial outcomes."
  },
  {
    "id": 291,
    "question": "Which of the following is a key metric for operational efficiency?",
    "options": ["Customer acquisition cost", "Inventory turnover ratio", "Social media reach", "Total liabilities"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Inventory turnover reflects how efficiently a business manages its inventory in relation to sales."
  },
  {
    "id": 292,
    "question": "Which of the following would most directly affect the assumptions in a financial projection?",
    "options": ["Office paint color", "Distribution channel changes", "Employee benefits", "Patent expiration timelines"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Changes in distribution channels can significantly alter cost structures and sales assumptions."
  },
  {
    "id": 293,
    "question": "What is the difference between gross margin and operating margin?",
    "options": ["Gross margin includes taxes; operating margin does not", "Operating margin subtracts more expenses like salaries and rent", "They are the same metric", "Gross margin includes only net profit"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Gross margin is revenue minus cost of goods sold; operating margin also subtracts operating expenses like rent and salaries."
  },
  {
    "id": 294,
    "question": "Why is liquidity analysis critical in a startup business plan?",
    "options": ["It helps choose packaging suppliers", "It forecasts profit margins", "It assesses ability to meet short-term obligations", "It ensures compliance with international tax law"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Liquidity analysis evaluates whether a startup can cover its short-term debts with its current assets."
  },
  {
    "id": 295,
    "question": "What kind of liability is typically listed under short-term obligations?",
    "options": ["Long-term lease", "Accounts payable", "Deferred taxes", "Retained earnings"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Accounts payable are short-term debts owed to suppliers or vendors, listed under current liabilities."
  },
  {
    "id": 296,
    "question": "Which component of a business plan is most likely to include customer archetypes?",
    "options": ["Operations Plan", "Financial Plan", "Marketing Plan", "Legal Structure"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Customer archetypes, or personas, are used in the marketing plan to tailor promotional strategies."
  },
  {
    "id": 297,
    "question": "Which funding source is most likely to require equity exchange?",
    "options": ["Bank loan", "Angel investment", "Crowdfunding donation", "Revenue reinvestment"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Angel investors usually provide funding in exchange for equity in the company."
  },
  {
    "id": 298,
    "question": "Why might a business plan emphasize competitive barriers?",
    "options": ["To avoid taxes", "To impress regulators", "To highlight protection from market threats", "To attract new employees"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Competitive barriers like patents or brand loyalty protect a business and reassure investors."
  },
  {
    "id": 299,
    "question": "What financial metric evaluates a company’s ability to use equity efficiently?",
    "options": ["ROA", "LTV", "ROE", "EBITDA"],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Return on Equity (ROE) shows how efficiently a company uses shareholder equity to generate profits."
  },
  {
    "id": 300,
    "question": "In a pitch, what makes traction data valuable to investors?",
    "options": ["It reduces fixed costs", "It proves product-market fit and early success", "It outlines hiring needs", "It replaces the need for branding"],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "3.2",
    "explanation": "Traction data shows user growth, sales, or partnerships, validating the business model’s viability."
  },
  {
    "id": 301,
    "question": "What is price in the context of the marketing mix?",
    "options": [
      "The total cost of production",
      "The money spent on advertising",
      "The amount of money consumers pay to buy a product",
      "The sum of all fixed and variable costs"
    ],
    "correctAnswer": "The amount of money consumers pay to buy a product",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Price refers to the amount of money consumers pay to buy a product, and it is the only element that generates revenue in the marketing mix."
  },
  {
    "id": 302,
    "question": "Which of the following best describes what price communicates?",
    "options": [
      "Factory efficiency and profit margins",
      "Sales targets and logistics data",
      "Brand, market position, and product quality",
      "Employee salaries and manufacturing output"
    ],
    "correctAnswer": "Brand, market position, and product quality",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Price communicates the brand, the position in the market, the quality of the product/service, and the image of the business."
  },
  {
    "id": 303,
    "question": "Which of the following is a characteristic of cost-based pricing?",
    "options": [
      "It is based on perceived customer value",
      "It begins by estimating customer demand",
      "It adds a markup percentage to product cost",
      "It uses competitor prices as a baseline"
    ],
    "correctAnswer": "It adds a markup percentage to product cost",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Cost-based pricing is calculated by adding a markup to the cost of the product."
  },
  {
    "id": 304,
    "question": "What does value-based pricing primarily rely on?",
    "options": [
      "Fixed manufacturing costs",
      "The cost of raw materials",
      "What consumers would pay for the product",
      "Discounted supplier prices"
    ],
    "correctAnswer": "What consumers would pay for the product",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Value-based pricing estimates what consumers would pay for a product and adjusts the price accordingly."
  },
  {
    "id": 305,
    "question": "Which of the following is a strategy to increase profitability without changing the base price?",
    "options": [
      "Cutting customer support",
      "Reducing product quality",
      "Including a surcharge",
      "Raising prices drastically"
    ],
    "correctAnswer": "Including a surcharge",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Including a surcharge instead of raising the price is a strategy to increase profitability."
  },
  {
    "id": 306,
    "question": "Which pricing tactic uses prices ending in .99 or similar figures?",
    "options": [
      "Zone pricing",
      "Odd pricing",
      "Bundling",
      "Leader pricing"
    ],
    "correctAnswer": "Odd pricing",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Odd pricing gives the impression of a lower price by using figures like 9.99 instead of 10.00."
  },
  {
    "id": 307,
    "question": "What does the markup percentage of retail price equal?",
    "options": [
      "Markup ÷ Cost",
      "Retail price – Markup",
      "Markup ÷ Retail price",
      "Markup ÷ Total expenses"
    ],
    "correctAnswer": "Markup ÷ Retail price",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Markup as a percentage of retail price is calculated as Markup ÷ Retail Price."
  },
  {
    "id": 308,
    "question": "Which pricing strategy includes a portion of fixed and variable factory overhead in each unit?",
    "options": [
      "Cost-plus pricing",
      "Variable costing",
      "Absorption pricing",
      "Leader pricing"
    ],
    "correctAnswer": "Absorption pricing",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Absorption pricing assigns a portion of both fixed and variable factory overhead costs to each unit."
  },
  {
    "id": 309,
    "question": "How do most service firms determine their prices?",
    "options": [
      "Using competitor data",
      "A flat monthly fee",
      "Hourly rate based on time required",
      "Bidding for contracts"
    ],
    "correctAnswer": "Hourly rate based on time required",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Service firms often base their prices on the number of hours required to perform the service."
  },
  {
    "id": 310,
    "question": "Why must credit card fees be considered in final product pricing?",
    "options": [
      "They reduce overhead",
      "They affect wholesale pricing",
      "They reduce the net income for merchants",
      "They increase the brand image"
    ],
    "correctAnswer": "They reduce the net income for merchants",
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Credit card fees and transaction charges reduce the final amount merchants receive, so they must be factored into pricing."
  },
  {
    "id": 311,
    "question": "Which pricing method involves setting the price based on what consumers are willing to pay?",
    "options": [
      "Cost-based pricing",
      "Value-based pricing",
      "Absorption pricing",
      "Freemium pricing"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Value-based pricing estimates what consumers would pay and adjusts accordingly."
  },
  {
    "id": 312,
    "question": "Which pricing tactic involves using odd numbers to give the impression of a lower price?",
    "options": [
      "Zone pricing",
      "Leader pricing",
      "Odd pricing",
      "Price lining"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Odd pricing uses prices like €9.99 instead of €10 to appear cheaper."
  },
  {
    "id": 313,
    "question": "In which pricing strategy are accessories priced separately from the main product?",
    "options": [
      "Captive-product pricing",
      "Bundling",
      "Optional-product pricing",
      "Dynamic pricing"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Optional-product pricing involves separate pricing for accessories."
  },
  {
    "id": 314,
    "question": "What is the main difference between absorption costing and variable costing?",
    "options": [
      "Absorption includes all fixed and variable overheads; variable only includes variable costs.",
      "Variable includes more fixed costs.",
      "Absorption uses a fixed profit margin.",
      "Variable costing uses direct materials only."
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Absorption costing includes all overheads, while variable includes only those that change with output."
  },
  {
    "id": 315,
    "question": "Which pricing method uses a fixed markup on the cost of goods sold?",
    "options": [
      "Markup pricing",
      "Dynamic pricing",
      "Value-based pricing",
      "Bundling"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Markup pricing adds a percentage to the product cost."
  },
  {
    "id": 316,
    "question": "What is a characteristic of freemium pricing?",
    "options": [
      "It adjusts prices based on location.",
      "It offers products for free with premium upgrades.",
      "It involves separate pricing for accessories.",
      "It prices the product based on customer demand."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Freemium gives a basic product for free and charges for premium features."
  },
  {
    "id": 317,
    "question": "What is the main goal of price transparency?",
    "options": [
      "Hide actual production costs",
      "Simplify payment systems",
      "Improve customer trust and loyalty",
      "Reduce overhead"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Price transparency helps customers trust the pricing process."
  },
  {
    "id": 318,
    "question": "Which strategy can improve profitability without raising the price of a product?",
    "options": [
      "Include a surcharge",
      "Offer more discounts",
      "Increase stock-out frequency",
      "Expand product line"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Adding surcharges instead of increasing base prices can help avoid customer pushback."
  },
  {
    "id": 319,
    "question": "What does bundling involve?",
    "options": [
      "Offering optional accessories",
      "Setting different prices by region",
      "Packaging products/services together for added value",
      "Pricing based on competition"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Bundling includes several items together at a better perceived value."
  },
  {
    "id": 320,
    "question": "How does leader pricing work?",
    "options": [
      "Sets prices lower than competitors to attract customers",
      "Sets prices based on production costs",
      "Reduces price of popular items to draw in customers",
      "Follows the pricing of industry leaders"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Leader pricing marks down key items to drive store traffic."
  },
  {
    "id": 321,
    "question": "In trade credit, how do companies encourage early payment?",
    "options": [
      "Allow layaways",
      "Impose late penalties",
      "Offer cash discounts",
      "Use installment plans"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Trade credit often includes cash discounts to speed up payment."
  },
  {
    "id": 322,
    "question": "Which cost is included in variable costing?",
    "options": [
      "Fixed overheads",
      "Depreciation",
      "Factory overheads that vary with output",
      "Marketing fees"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Variable costing includes only costs that vary with output."
  },
  {
    "id": 323,
    "question": "What impact does pricing have on profitability?",
    "options": [
      "Less than cost reduction",
      "Greater than cost reduction",
      "Equal to cost reduction",
      "Only in long-term strategies"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Pricing has a greater effect on profit than reducing costs."
  },
  {
    "id": 324,
    "question": "What does suggested retail pricing mean?",
    "options": [
      "Price fixed by law",
      "Price used in freemium models",
      "Price proposed by manufacturer for resellers",
      "Lowest possible selling price"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Manufacturers suggest retail prices for consistency across sellers."
  },
  {
    "id": 325,
    "question": "Which pricing method includes both fixed and variable overheads?",
    "options": [
      "Variable costing",
      "Absorption pricing",
      "Value-based pricing",
      "Markup pricing"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Absorption pricing includes all types of overhead."
  },
  {
    "id": 326,
    "question": "What is a characteristic of credit card payments?",
    "options": [
      "No additional cost for companies",
      "Fees are only charged to customers",
      "Companies pay transaction and percentage fees",
      "They do not affect pricing"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Credit card processing costs are borne by companies."
  },
  {
    "id": 327,
    "question": "Why do customers tend to spend more with credit cards?",
    "options": [
      "Lower interest rates",
      "Discounts",
      "Delayed payment effect",
      "Reward points"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "The psychological effect of delayed payment leads to higher spending."
  },
  {
    "id": 328,
    "question": "Which type of credit is often used for high-priced durable goods?",
    "options": [
      "Trade credit",
      "Installment credit",
      "Credit card",
      "Cash credit"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Installment credit is typical for big-ticket items like cars or appliances."
  },
  {
    "id": 329,
    "question": "Which strategy focuses on making the product more efficient to increase profitability?",
    "options": [
      "Freemium pricing",
      "Dynamic pricing",
      "Improving operations",
      "Bundling"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Operational efficiency helps reduce costs and boost margins."
  },
  {
    "id": 330,
    "question": "What does dynamic pricing mean?",
    "options": [
      "Pricing is the same everywhere",
      "Customers get prices adjusted to their profile",
      "Prices are set below cost",
      "Prices are static over time"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.1",
    "explanation": "Dynamic pricing involves customized pricing based on customer data or market conditions."
  },
  {
    "id": 331,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which of the following best explains why pricing is considered the most critical element in the marketing mix in terms of profitability?",
    "options": [
      "It determines customer loyalty more than any other factor.",
      "It is the only element that directly generates revenue.",
      "It requires the least investment to implement.",
      "It influences the other Ps in the marketing mix."
    ],
    "correctAnswer": 1,
    "explanation": "Price is the only element in the marketing mix that directly produces revenue; the others represent costs."
  },
  {
    "id": 332,
    "subject": "economy",
    "topic": "4.1",
    "question": "A company uses the following method to set prices: it estimates what customers would be willing to pay and then subtracts a margin to ensure competitiveness. This is an example of:",
    "options": [
      "Cost-based pricing",
      "Value-based pricing",
      "Odd pricing",
      "Markup pricing"
    ],
    "correctAnswer": 1,
    "explanation": "Value-based pricing estimates the perceived value to the customer and adjusts to include a cushion."
  },
  {
    "id": 333,
    "subject": "economy",
    "topic": "4.1",
    "question": "A firm adopts freemium pricing. Which of the following best describes its expected strategy?",
    "options": [
      "Offer a core product for free and sell upgraded features.",
      "Offer lower prices for bulk purchases.",
      "Charge different prices in different geographical areas.",
      "Offer limited-time discounts to promote sales."
    ],
    "correctAnswer": 0,
    "explanation": "Freemium pricing provides basic features for free and charges for premium functionalities."
  },
  {
    "id": 334,
    "subject": "economy",
    "topic": "4.1",
    "question": "What is a major drawback of dynamic pricing if not handled transparently?",
    "options": [
      "It causes cost-based losses.",
      "It leads to customer confusion and distrust.",
      "It limits access to global markets.",
      "It complicates bundling strategies."
    ],
    "correctAnswer": 1,
    "explanation": "Dynamic pricing can alienate customers if perceived as unfair or inconsistent."
  },
  {
    "id": 335,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which pricing tactic is most suitable for introducing a new product to attract foot traffic into a retail store?",
    "options": [
      "Zone pricing",
      "Leader pricing",
      "Optional-product pricing",
      "Price lining"
    ],
    "correctAnswer": 1,
    "explanation": "Leader pricing involves marking down a popular item to attract customers into the store."
  },
  {
    "id": 336,
    "subject": "economy",
    "topic": "4.1",
    "question": "A firm calculates its markup as a percentage of cost rather than of the retail price. This method:",
    "options": [
      "Typically yields a lower apparent percentage.",
      "Requires a lower breakeven point.",
      "Is less common in competitive markets.",
      "Shows a higher margin on low-cost items."
    ],
    "correctAnswer": 3,
    "explanation": "Markup as a percentage of cost shows a higher relative profit on lower-cost items."
  },
  {
    "id": 337,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which of the following is NOT included in the cost structure of absorption pricing?",
    "options": [
      "Direct materials",
      "Variable factory overhead",
      "Fixed factory overhead",
      "Opportunity cost"
    ],
    "correctAnswer": 3,
    "explanation": "Absorption pricing includes both fixed and variable costs but does not factor in opportunity cost directly."
  },
  {
    "id": 338,
    "subject": "economy",
    "topic": "4.1",
    "question": "Why might a company prefer variable costing over absorption costing?",
    "options": [
      "It gives a better picture of total profitability.",
      "It simplifies external financial reporting.",
      "It focuses on costs that fluctuate with production levels.",
      "It includes all overhead in each unit's price."
    ],
    "correctAnswer": 2,
    "explanation": "Variable costing includes only variable costs, aligning costs directly with output levels."
  },
  {
    "id": 339,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which strategy does NOT help improve profitability without directly raising the product's unit price?",
    "options": [
      "Reducing discount programs",
      "Selling smaller product quantities",
      "Lowering production costs",
      "Offering interest-free credit options"
    ],
    "correctAnswer": 3,
    "explanation": "Offering credit may increase sales but adds administrative and financial costs."
  },
  {
    "id": 340,
    "subject": "economy",
    "topic": "4.1",
    "question": "How does pricing communicate a company's market position?",
    "options": [
      "Through the number of channels used",
      "Via the time required to launch products",
      "By implying the brand image and quality perception",
      "Based on the taxes charged to customers"
    ],
    "correctAnswer": 2,
    "explanation": "Price influences perceived brand value and market positioning in the minds of consumers."
  },
  {
    "id": 341,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which of the following pricing tactics involves packaging products and services together for a single price?",
    "options": [
      "Bundling",
      "Lining",
      "Odd pricing",
      "Dynamic pricing"
    ],
    "correctAnswer": 0,
    "explanation": "Bundling combines products and/or services into a single offer to increase perceived value."
  },
  {
    "id": 342,
    "subject": "economy",
    "topic": "4.1",
    "question": "A merchant receives €97.67 after a €100 credit card sale. What does this most likely reflect?",
    "options": [
      "Late payment fees",
      "Customer discounts",
      "Credit card transaction and interchange fees",
      "Retail markdown losses"
    ],
    "correctAnswer": 2,
    "explanation": "Credit card processing and interchange fees reduce the final amount received by the merchant."
  },
  {
    "id": 343,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which of the following is a primary cost consideration for service firms when setting prices?",
    "options": [
      "Geographic distance",
      "Packaging costs",
      "Hourly labor and materials",
      "Customer discounts"
    ],
    "correctAnswer": 2,
    "explanation": "Service firms base prices largely on labor hours and the material costs involved."
  },
  {
    "id": 344,
    "subject": "economy",
    "topic": "4.1",
    "question": "What is the main reason companies use installment credit for high-ticket items?",
    "options": [
      "To improve delivery speed",
      "To allow customers to pay through regular, affordable amounts",
      "To increase stock rotation",
      "To reduce VAT liability"
    ],
    "correctAnswer": 1,
    "explanation": "Installment credit makes expensive purchases more accessible through smaller payments over time."
  },
  {
    "id": 345,
    "subject": "economy",
    "topic": "4.1",
    "question": "In which pricing method is a fixed percentage added to the unit cost to determine the price?",
    "options": [
      "Absorption pricing",
      "Cost-plus pricing",
      "Freemium pricing",
      "Zone pricing"
    ],
    "correctAnswer": 1,
    "explanation": "Cost-plus pricing adds a markup to the cost to determine the final selling price."
  },
  {
    "id": 346,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which tactic uses psychological perception to make prices appear lower?",
    "options": [
      "Odd pricing",
      "Bundling",
      "Captive-product pricing",
      "Dynamic pricing"
    ],
    "correctAnswer": 0,
    "explanation": "Odd pricing uses non-rounded numbers (like 9.99) to give the impression of a lower price."
  },
  {
    "id": 347,
    "subject": "economy",
    "topic": "4.1",
    "question": "Why might a company use suggested retail pricing?",
    "options": [
      "To ensure variable cost consistency",
      "To let manufacturers control distribution prices",
      "To increase the break-even point",
      "To encourage price wars"
    ],
    "correctAnswer": 1,
    "explanation": "Manufacturers suggest retail prices to maintain consistency and competitiveness across distributors."
  },
  {
    "id": 348,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which of these is a primary benefit of follow-the-leader pricing?",
    "options": [
      "It allows complete autonomy in pricing.",
      "It enhances product differentiation.",
      "It simplifies competitive positioning.",
      "It eliminates production costs."
    ],
    "correctAnswer": 2,
    "explanation": "Follow-the-leader pricing simplifies decision-making by aligning with market standards set by leading competitors."
  },
  {
    "id": 349,
    "subject": "economy",
    "topic": "4.1",
    "question": "Which crediting strategy allows companies to avoid financing purchases but still secure future sales?",
    "options": [
      "Trade credit",
      "Credit card use",
      "Layaway plans",
      "Installment credit"
    ],
    "correctAnswer": 2,
    "explanation": "Layaway plans allow customers to pay in advance over time without taking the product until it’s fully paid."
  },
  {
    "id": 350,
    "subject": "economy",
    "topic": "4.1",
    "question": "What does pricing transparency involve?",
    "options": [
      "Hiding markups from customers",
      "Changing prices dynamically without notice",
      "Being open about how and why prices are set",
      "Providing volume discounts secretly"
    ],
    "correctAnswer": 2,
    "explanation": "Transparency in pricing means clearly communicating how prices are determined and what they include."
  },
 {
    "id": 351,
    "question": "What is the primary purpose of basic financial statements in a company?",
    "options": [
      "To forecast future trends and revenues",
      "To compare marketing strategies",
      "To obtain a snapshot of the company’s activity for internal and external use",
      "To calculate employee bonuses"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Financial statements provide a comprehensive 'photography' of the company's activity and are meant for both internal and external audiences."
  },
  {
    "id": 352,
    "question": "Which of the following is NOT typically considered a current asset?",
    "options": [
      "Cash",
      "Accounts receivable",
      "Inventory",
      "Buildings"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Buildings are fixed assets used for long-term operations, not current assets convertible into cash within one year."
  },
  {
    "id": 353,
    "question": "What does the balance statement primarily show?",
    "options": [
      "Company profitability over a period",
      "Marketing performance indicators",
      "Assets, liabilities, and owners’ equity at a specific point in time",
      "Cash flow trends over a fiscal year"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The balance statement shows the financial position of a business at a given moment, listing assets, liabilities, and equity."
  },
  {
    "id": 354,
    "question": "Which type of asset has the highest liquidity?",
    "options": [
      "Intangible asset",
      "Fixed asset",
      "Current asset",
      "Tangible asset"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Current assets are easily converted into cash within a year and thus have the highest liquidity."
  },
  {
    "id": 355,
    "question": "What does a high debt-to-equity ratio suggest about a company?",
    "options": [
      "It has a low level of profitability",
      "It is overly reliant on shareholder funding",
      "It may be in financial distress and highly leveraged",
      "It has a strong capacity for liquidity"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A high debt-to-equity ratio indicates heavy reliance on borrowed funds, implying greater risk for investors."
  },
  {
    "id": 356,
    "question": "Which ratio refines the general liquidity ratio by excluding inventories?",
    "options": [
      "Debt-to-equity ratio",
      "Quick ratio",
      "Cash ratio",
      "Total asset turnover ratio"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The quick ratio excludes inventories to measure only the most liquid assets available to cover short-term liabilities."
  },
  {
    "id": 357,
    "question": "What is considered a healthy benchmark for the Current Ratio?",
    "options": [
      "1:1",
      "0.5:1",
      "2:1",
      "3:1"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A current ratio of 2:1 is considered healthy, especially for service businesses, as it means twice the assets compared to liabilities."
  },
  {
    "id": 358,
    "question": "What does a negative working capital indicate?",
    "options": [
      "Strong investor confidence",
      "Potential financial difficulties and inability to cover short-term liabilities",
      "Excessive equity funding",
      "A profitable operational structure"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Negative working capital suggests the company may struggle to meet short-term obligations, which can lead to financial distress."
  },
  {
    "id": 359,
    "question": "What is EBITDA a measure of?",
    "options": [
      "Company net income after taxes",
      "Profit from operations before interest, tax, depreciation, and amortization",
      "Company’s liquidity over time",
      "Total asset turnover ratio"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "EBITDA measures earnings from core operations, excluding interest, taxes, depreciation, and amortization."
  },
  {
    "id": 360,
    "question": "If a firm has an EBITDA < 0, what does it imply?",
    "options": [
      "It is highly efficient",
      "It has positive net income",
      "It is experiencing operating losses and potentially shrinking",
      "It is receiving external subsidies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A negative EBITDA shows the firm is not profitable from its core operations and may be losing assets and value."
  },
  {
    "id": 361,
    "question": "What is the formula to calculate working capital?",
    "options": [
      "Total assets - Total liabilities",
      "Current assets - Current liabilities",
      "Net income - Operating expenses",
      "Equity + Long-term debt"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Working capital is calculated by subtracting current liabilities from current assets."
  },
  {
    "id": 362,
    "question": "Which of the following is a long-term liability?",
    "options": [
      "Accounts payable",
      "Wages payable",
      "Short-term loans",
      "Mortgage payable"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Mortgage payable is a long-term liability, usually repaid over several years."
  },
  {
    "id": 363,
    "question": "What does a high current ratio generally indicate?",
    "options": [
      "Low liquidity",
      "Strong liquidity position",
      "High debt levels",
      "Low asset turnover"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A high current ratio shows the company has more current assets than liabilities, indicating good short-term financial health."
  },
  {
    "id": 364,
    "question": "Which of these is an intangible asset?",
    "options": [
      "Machinery",
      "Inventory",
      "Patents",
      "Buildings"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Patents are intangible assets since they lack physical substance but have value."
  },
  {
    "id": 365,
    "question": "Why is the quick ratio more conservative than the current ratio?",
    "options": [
      "It includes only long-term liabilities",
      "It ignores cash balances",
      "It excludes inventory from current assets",
      "It excludes short-term liabilities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The quick ratio excludes inventory because it’s not always quickly convertible into cash."
  },
  {
    "id": 366,
    "question": "Which item would NOT appear on a balance sheet?",
    "options": [
      "Cash",
      "Revenue",
      "Accounts payable",
      "Equity"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Revenue appears in the income statement, not the balance sheet."
  },
  {
    "id": 367,
    "question": "In financial accounting, what does 'equity' represent?",
    "options": [
      "The company's debt",
      "The value owed to employees",
      "The owners’ residual interest after liabilities",
      "The total amount of fixed assets"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Equity is the residual value after subtracting liabilities from assets; it belongs to the owners."
  },
  {
    "id": 368,
    "question": "Which of the following is a current liability?",
    "options": [
      "Patent amortization",
      "Bank loan payable in 10 years",
      "Accounts payable",
      "Equity capital"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Accounts payable are obligations due within a short period and are thus current liabilities."
  },
  {
    "id": 369,
    "question": "What does the term 'liquidity' refer to in financial statements?",
    "options": [
      "A company's ability to expand operations",
      "The volume of equity capital",
      "The ability to meet short-term obligations",
      "The profitability over time"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Liquidity refers to how easily a company can pay its short-term debts using its current assets."
  },
  {
    "id": 370,
    "question": "What does a low quick ratio generally indicate?",
    "options": [
      "Strong asset base",
      "Inability to pay short-term debts quickly",
      "High profitability",
      "Overvaluation of inventory"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A low quick ratio means the company may struggle to meet short-term obligations using only liquid assets."
  },
  {
    "id": 371,
    "question": "EBITDA helps investors understand...",
    "options": [
      "Cash flow from investment activities",
      "The true cost of debt financing",
      "Operational profitability excluding financial and accounting adjustments",
      "The fair market value of company assets"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "EBITDA isolates profitability from the effects of financing and non-cash accounting decisions."
  },
  {
    "id": 372,
    "question": "Which of these would increase owners’ equity?",
    "options": [
      "Issuing new shares",
      "Paying dividends",
      "Taking on a loan",
      "Buying new inventory"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Issuing new shares increases equity by bringing in capital from investors."
  },
  {
    "id": 373,
    "question": "Which component is necessary for calculating the current ratio?",
    "options": [
      "Total liabilities",
      "Owner's equity",
      "Fixed assets",
      "Current liabilities"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The current ratio divides current assets by current liabilities to assess liquidity."
  },
  {
    "id": 374,
    "question": "Depreciation affects which type of asset?",
    "options": [
      "Current asset",
      "Fixed asset",
      "Intangible asset",
      "Financial asset"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Depreciation accounts for the loss of value of fixed (tangible) assets over time."
  },
  {
    "id": 375,
    "question": "What is the main limitation of EBITDA?",
    "options": [
      "It includes non-operating income",
      "It ignores the effect of interest and taxes",
      "It does not reflect true cash flow",
      "It is too simple for startups"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "EBITDA excludes capital expenditures and debt payments, so it can mislead about true cash flow."
  },
  {
    "id": 376,
    "question": "Which of the following best describes intangible assets?",
    "options": [
      "Assets with no value",
      "Assets with a physical form",
      "Non-physical assets with future economic benefit",
      "Short-term investment items"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Intangible assets are non-physical assets that provide future benefits, like trademarks and goodwill."
  },
  {
    "id": 377,
    "question": "Which financial statement best shows profitability over a time period?",
    "options": [
      "Balance sheet",
      "Cash flow statement",
      "Income statement",
      "Owner's equity statement"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The income statement summarizes revenues and expenses to show net profit or loss."
  },
  {
    "id": 378,
    "question": "A quick ratio less than 1 typically suggests that a company...",
    "options": [
      "Is highly profitable",
      "Cannot pay short-term liabilities with its most liquid assets",
      "Has too much inventory",
      "Has excessive fixed assets"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "A quick ratio under 1 indicates insufficient liquid assets to meet short-term obligations."
  },
  {
    "id": 379,
    "question": "Which of the following is not included in EBITDA?",
    "options": [
      "Revenue",
      "Operating expenses",
      "Depreciation",
      "Interest"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "EBITDA excludes depreciation, interest, taxes, and amortization to focus on core operations."
  },
  {
    "id": 380,
    "question": "Why might a company have a high current ratio but still struggle financially?",
    "options": [
      "It has high quick ratio",
      "Most of its current assets are not easily liquidated",
      "It has no long-term debt",
      "It is highly profitable"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "If current assets are tied up in slow-moving inventory, the firm may still face cash flow problems despite a high current ratio."
  },
   {
    "id": 381,
    "question": "Which of the following would most likely distort the usefulness of the current ratio as a measure of liquidity?",
    "options": [
      "Large cash reserves",
      "Highly liquid marketable securities",
      "High inventory levels that are slow to sell",
      "High accounts receivable turnover"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The current ratio may appear healthy despite low liquidity if current assets consist largely of inventory that is not quickly sold."
  },
  {
    "id": 382,
    "question": "A company’s total liabilities increase while its total assets remain constant. What must happen to its equity?",
    "options": [
      "Equity remains the same",
      "Equity increases",
      "Equity decreases",
      "Equity becomes negative"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "According to the accounting equation (Assets = Liabilities + Equity), if liabilities rise and assets are constant, equity must decrease."
  },
  {
    "id": 383,
    "question": "Which financial statement would you analyze to determine whether a company can sustain operations without external financing?",
    "options": [
      "Balance sheet",
      "Income statement",
      "Statement of cash flows",
      "Statement of changes in equity"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The statement of cash flows, especially operating activities, reveals whether the business generates enough cash to sustain itself."
  },
  {
    "id": 384,
    "question": "Which of the following transactions would NOT affect equity directly?",
    "options": [
      "Issuance of common stock",
      "Payment of dividends",
      "Borrowing from a bank",
      "Net profit earned"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Borrowing increases liabilities but does not directly affect equity."
  },
  {
    "id": 385,
    "question": "How does depreciation affect the financial statements?",
    "options": [
      "Reduces cash flow from financing activities",
      "Increases net income",
      "Reduces both net income and asset value",
      "Increases equity over time"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Depreciation is a non-cash expense that lowers reported net income and reduces the book value of fixed assets."
  },
  {
    "id": 386,
    "question": "If a company capitalizes rather than expenses a cost, how are the financial statements affected in the short term?",
    "options": [
      "Net income is lower",
      "Total assets are lower",
      "Equity is reduced",
      "Net income is higher"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Capitalizing spreads the cost over time, so current net income appears higher compared to expensing it all at once."
  },
  {
    "id": 387,
    "question": "Which ratio best evaluates a firm's ability to meet long-term obligations?",
    "options": [
      "Current ratio",
      "Debt-to-equity ratio",
      "Quick ratio",
      "Gross profit margin"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "The debt-to-equity ratio measures financial leverage and indicates the firm’s reliance on debt financing for long-term obligations."
  },
  {
    "id": 388,
    "question": "A company has positive EBITDA but negative net income. What does this indicate?",
    "options": [
      "The company is profitable overall",
      "Non-operating expenses or depreciation are significant",
      "The company has high current liabilities",
      "The company is undervalued"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "EBITDA excludes interest, taxes, depreciation, and amortization. If net income is negative, these excluded costs are significant."
  },
  {
    "id": 389,
    "question": "If a firm’s return on equity (ROE) is decreasing despite stable net income, what is most likely happening?",
    "options": [
      "Debt is increasing",
      "Assets are decreasing",
      "Equity is increasing",
      "Dividends are increasing"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "ROE = Net Income / Equity. If equity grows and net income remains constant, ROE will fall."
  },
  {
    "id": 390,
    "question": "Which of the following would be considered an off-balance-sheet item?",
    "options": [
      "Deferred tax liabilities",
      "Operating lease obligations (under old accounting rules)",
      "Accounts receivable",
      "Inventory"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Prior to accounting changes, operating leases were not recorded on the balance sheet, making them off-balance-sheet items."
  },
  {
    "id": 391,
    "question": "How does FIFO (First In, First Out) inventory accounting affect financials during inflation?",
    "options": [
      "Lowers reported income",
      "Results in higher inventory value on the balance sheet",
      "Leads to lower taxes",
      "Shows lower gross margin"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "In inflation, FIFO assigns older (cheaper) costs to COGS, resulting in higher profits and higher inventory value."
  },
  {
    "id": 392,
    "question": "Which change would most likely improve a company’s quick ratio?",
    "options": [
      "Purchasing inventory with cash",
      "Collecting accounts receivable",
      "Issuing long-term debt",
      "Buying fixed assets with equity"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Collecting receivables increases cash and improves the quick ratio, which excludes inventory."
  },
  {
    "id": 393,
    "question": "If a company uses aggressive revenue recognition practices, which financial statement is most immediately affected?",
    "options": [
      "Balance sheet",
      "Income statement",
      "Statement of cash flows",
      "Statement of equity"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Aggressive revenue recognition inflates revenue and net income on the income statement prematurely."
  },
  {
    "id": 394,
    "question": "Under accrual accounting, revenue is recognized when...",
    "options": [
      "Cash is received",
      "Inventory is ordered",
      "Goods or services are delivered",
      "A purchase order is received"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Accrual accounting recognizes revenue when earned, typically upon delivery of goods or services, regardless of cash receipt."
  },
  {
    "id": 395,
    "question": "What is the primary purpose of a classified balance sheet?",
    "options": [
      "To report tax liabilities separately",
      "To organize assets and liabilities by liquidity",
      "To list items in alphabetical order",
      "To exclude non-current items"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Classified balance sheets group items by current vs. non-current, helping users assess liquidity and solvency."
  },
  {
    "id": 396,
    "question": "An increase in accounts payable has what effect on the cash flow statement?",
    "options": [
      "Increases cash from operating activities",
      "Decreases cash from investing activities",
      "Increases financing cash flows",
      "Reduces net income"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "An increase in accounts payable means the company delayed payments, conserving cash in operations."
  },
  {
    "id": 397,
    "question": "A company with high depreciation but low capital expenditures may indicate...",
    "options": [
      "Strong growth potential",
      "A shrinking asset base",
      "Overvaluation of assets",
      "Rising profit margins"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Low capital investment despite high depreciation suggests the company is not replacing aging assets."
  },
  {
    "id": 398,
    "question": "Which ratio best assesses how effectively a company uses its assets to generate profit?",
    "options": [
      "Return on assets (ROA)",
      "Current ratio",
      "EBITDA margin",
      "Debt-to-equity ratio"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "ROA measures net income against total assets, indicating how efficiently the assets are used to generate profit."
  },
  {
    "id": 399,
    "question": "Which financial metric would an investor primarily analyze to assess shareholder profitability?",
    "options": [
      "Net profit margin",
      "Return on equity (ROE)",
      "Operating margin",
      "Interest coverage ratio"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "ROE reveals how much profit is generated with shareholders’ equity and is key to assessing investor returns."
  },
  {
    "id": 400,
    "question": "If a company reports positive cash flow from operations but negative net income, which of the following is most likely true?",
    "options": [
      "It is inflating its income",
      "It has substantial non-cash expenses like depreciation",
      "It is not generating revenue",
      "It is not paying its suppliers"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.2",
    "explanation": "Non-cash expenses such as depreciation reduce net income but do not affect actual cash flow, explaining the disparity."
  },
  {
    "id": 401,
    "question": "What is the most critical factor determining whether a start-up can continue operating?",
    "options": [
      "High initial sales",
      "Strong branding",
      "Cash availability",
      "Product innovation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Start-ups often don't generate positive cash flow at the beginning, so cash availability—not sales or profit—is what determines their survival."
  },
  {
    "id": 402,
    "question": "What is the 'valley of death' in the context of start-ups?",
    "options": [
      "A drop in market demand",
      "The phase of negative cash flow before becoming self-supporting",
      "A period of profit before a crash",
      "The phase of legal registration and tax payment"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "The 'valley of death' refers to the time during which start-ups face negative cash flow as they work to build a customer base and become self-sustaining."
  },
  {
    "id": 403,
    "question": "Which of the following activities is NOT typically included in cash flow management?",
    "options": [
      "Forecasting cash needs",
      "Collecting and disbursing cash",
      "Planning for product development",
      "Investing surplus funds"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Cash flow management includes forecasting, collecting, disbursing, investing, and planning cash—not directly product development."
  },
  {
    "id": 404,
    "question": "Which activity shows cash exchanged between a company and its owners or creditors?",
    "options": [
      "Operating activities",
      "Investing activities",
      "Financing activities",
      "Marketing activities"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Financing activities reflect the cash flow between the business and owners/creditors, such as debt payments and dividends."
  },
  {
    "id": 405,
    "question": "Why is a short working capital cycle beneficial for a company?",
    "options": [
      "It increases fixed assets",
      "It improves customer service",
      "It provides more liquidity",
      "It reduces labor costs"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A shorter working capital cycle means the company gets cash faster, improving liquidity and reducing reliance on external funds."
  },
  {
    "id": 406,
    "question": "What does a high Average Inventory Turnover (AIT) ratio typically indicate?",
    "options": [
      "Poor inventory management",
      "Obsolete inventory",
      "Strong sales or low inventory",
      "Decreased liquidity"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A high AIT ratio suggests the company is efficiently selling and restocking its inventory, which is positive."
  },
  {
    "id": 407,
    "question": "What is a potential consequence of a low inventory turnover ratio?",
    "options": [
      "Higher profitability",
      "Lower interest expenses",
      "Obsolete or overstocked inventory",
      "Improved customer satisfaction"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Low inventory turnover may indicate poor management, obsolete goods, and results in increased costs and reduced profitability."
  },
  {
    "id": 408,
    "question": "Which ratio indicates the average number of days it takes to collect accounts receivable?",
    "options": [
      "Payables period",
      "Inventory turnover",
      "Collection period",
      "Sales margin"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "The collection period shows how long it takes to collect receivables. A higher number indicates potential cash flow issues."
  },
  {
    "id": 409,
    "question": "If a firm has a collection period above 40 days, what risk increases?",
    "options": [
      "Higher inventory turnover",
      "Lower demand",
      "Bad debt losses",
      "Cash surplus"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A long collection period increases the risk of bad debts and cash shortages."
  },
  {
    "id": 410,
    "question": "What does a very high average payables period suggest?",
    "options": [
      "Efficient operations",
      "Strong supplier relationships",
      "Delayed payments or overdue accounts",
      "Improved working capital"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A very high payables period might indicate the firm is delaying payments, which could damage its credit reputation."
  },
  {
    "id": 411,
    "question": "Which financial activity involves cash flow from buying or selling assets like property or equipment?",
    "options": [
      "Operating activity",
      "Financing activity",
      "Investing activity",
      "Leasing activity"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Investing activities involve the purchase or sale of long-term assets like property, equipment, or securities."
  },
  {
    "id": 412,
    "question": "Which of the following is NOT a benefit of strong cash flow management?",
    "options": [
      "Minimizing cost of capital",
      "Avoiding insolvency",
      "Maximizing cash surpluses",
      "Delaying customer payments"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Delaying customer payments would harm cash flow. Strong cash management focuses on early collections and controlled spending."
  },
  {
    "id": 413,
    "question": "What is a common way to shorten the cash conversion cycle?",
    "options": [
      "Extend payables period indefinitely",
      "Increase inventory levels",
      "Speed up receivables collection",
      "Reduce product prices"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Speeding up the collection of receivables brings in cash faster, shortening the cash conversion cycle."
  },
  {
    "id": 414,
    "question": "What does it mean when a company has negative working capital?",
    "options": [
      "It has more current liabilities than current assets",
      "It is operating at a profit",
      "It has no long-term debt",
      "It is overcapitalized"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Negative working capital means the company’s short-term obligations exceed its short-term assets, which may be risky."
  },
  {
    "id": 415,
    "question": "What is the primary goal of working capital management?",
    "options": [
      "Maximize tax efficiency",
      "Minimize capital investment",
      "Ensure liquidity and operational efficiency",
      "Reduce sales fluctuations"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Working capital management aims to ensure the business has enough liquidity for its day-to-day operations."
  },
  {
    "id": 416,
    "question": "Which financial statement best reflects cash inflows and outflows?",
    "options": [
      "Income statement",
      "Balance sheet",
      "Cash flow statement",
      "Retained earnings report"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "The cash flow statement shows actual cash movements in and out of the company."
  },
  {
    "id": 417,
    "question": "A business with a long inventory turnover period may struggle with:",
    "options": [
      "Staff retention",
      "High marketing costs",
      "Tied-up cash in unsold goods",
      "Underpriced assets"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Slow inventory turnover ties up cash in stock that isn't generating revenue."
  },
  {
    "id": 418,
    "question": "Why might a business want to lengthen its average payables period?",
    "options": [
      "To receive discounts",
      "To conserve cash flow",
      "To gain supplier trust",
      "To reduce liabilities"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Delaying payments allows a business to hold on to cash longer, improving short-term liquidity."
  },
  {
    "id": 419,
    "question": "What could be a risk of excessively delaying payments to suppliers?",
    "options": [
      "Reduced product quality",
      "Supplier refusing further business",
      "Increased profit margins",
      "Lower fixed costs"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Suppliers may stop doing business with a company that consistently delays payments, damaging supply chains."
  },
  {
    "id": 420,
    "question": "What happens if a business collects receivables faster than it pays its bills?",
    "options": [
      "It incurs a deficit",
      "It improves cash flow",
      "It increases liabilities",
      "It lowers revenue"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "This timing improves liquidity by keeping cash on hand for longer before having to pay expenses."
  },
  {
    "id": 421,
    "question": "In cash flow terms, what is the danger of overtrading?",
    "options": [
      "Higher debt ratios",
      "Rapid growth exceeding available cash",
      "Fewer working hours",
      "Overpaying taxes"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Overtrading happens when a business grows faster than its cash flow can support, leading to liquidity issues."
  },
  {
    "id": 422,
    "question": "Which strategy can help reduce the collection period?",
    "options": [
      "Raising prices",
      "Offering cash discounts for early payment",
      "Extending credit terms",
      "Delaying invoicing"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Incentivizing early payment with discounts can shorten the time it takes to collect cash."
  },
  {
    "id": 423,
    "question": "What is the impact of increasing sales on cash flow if receivables collection remains slow?",
    "options": [
      "Improved cash flow",
      "No impact",
      "Worsened cash flow",
      "Lower asset turnover"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "More sales on credit with slow collection worsens cash flow, tying up cash in receivables."
  },
  {
    "id": 424,
    "question": "Which action would most directly improve the Average Inventory Turnover ratio?",
    "options": [
      "Lowering product prices",
      "Increasing production",
      "Reducing inventory levels",
      "Raising wages"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Lower inventory levels, while maintaining sales, will improve the turnover ratio."
  },
  {
    "id": 425,
    "question": "A business that pays its suppliers in 60 days and collects from customers in 30 days is likely to:",
    "options": [
      "Have cash flow problems",
      "Need more inventory",
      "Have positive cash flow timing",
      "Reduce net income"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "This creates a favorable cash flow position by getting money in before having to pay it out."
  },
  {
    "id": 426,
    "question": "Why might a business delay payment to suppliers even if it has sufficient cash?",
    "options": [
      "To invest surplus cash temporarily",
      "To reduce fixed costs",
      "To avoid taxes",
      "To improve customer loyalty"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Delaying payments allows temporary use of surplus cash for short-term investments or interest generation."
  },
  {
    "id": 427,
    "question": "Which activity is classified under operating activities in a cash flow statement?",
    "options": [
      "Paying dividends",
      "Purchasing equipment",
      "Receiving customer payments",
      "Issuing shares"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Operating activities include cash from core operations, such as customer payments and supplier expenses."
  },
  {
    "id": 428,
    "question": "What kind of financing is most commonly used to cover short-term cash shortages?",
    "options": [
      "Equity investment",
      "Long-term loans",
      "Overdraft facilities",
      "Lease agreements"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Overdrafts are flexible, short-term solutions used by businesses to cover brief cash deficits."
  },
  {
    "id": 429,
    "question": "A company with a short payables period and long receivables period may experience:",
    "options": [
      "Positive working capital",
      "Cash flow problems",
      "Lower profit margins",
      "Inventory surplus"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Paying suppliers quickly while collecting slowly creates a cash gap that can strain liquidity."
  },
  {
    "id": 430,
    "question": "Which is the best reason to maintain an optimal inventory level?",
    "options": [
      "To impress investors",
      "To minimize storage costs and avoid stockouts",
      "To increase fixed costs",
      "To raise asset valuation"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Maintaining the right inventory level reduces holding costs and ensures product availability, optimizing cash flow and service."
  },
  {
    "id": 431,
    "question": "Which of the following best describes the impact of an increasing cash conversion cycle on a company's liquidity?",
    "options": [
      "Liquidity improves as cash is tied up longer",
      "Liquidity deteriorates as cash is tied up longer",
      "No effect on liquidity",
      "Liquidity improves due to faster payments"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A longer cash conversion cycle means cash remains tied up in inventory and receivables longer, reducing liquidity."
  },
  {
    "id": 432,
    "question": "If a company reduces its accounts receivable days but its inventory turnover days increase, what is the likely net effect on working capital?",
    "options": [
      "Working capital will definitely decrease",
      "Working capital will definitely increase",
      "Effect on working capital depends on magnitude of changes",
      "No effect on working capital"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Changes in receivables and inventory affect working capital in opposite ways; the net effect depends on the size of those changes."
  },
  {
    "id": 433,
    "question": "Which statement correctly explains the use of factoring to improve cash flow?",
    "options": [
      "Factoring extends the payment terms with suppliers",
      "Factoring allows a company to sell its receivables for immediate cash",
      "Factoring reduces inventory holding costs",
      "Factoring increases the accounts payable period"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Factoring is the process of selling accounts receivable to a third party at a discount to receive immediate cash."
  },
  {
    "id": 434,
    "question": "In what way does just-in-time (JIT) inventory management most significantly affect the cash conversion cycle?",
    "options": [
      "Increases inventory days, lengthening the cycle",
      "Decreases inventory days, shortening the cycle",
      "Has no effect on the cash conversion cycle",
      "Increases receivables days"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "JIT reduces inventory levels by receiving goods only as needed, thus decreasing inventory days and shortening the cash conversion cycle."
  },
  {
    "id": 435,
    "question": "Which of the following risks is most associated with aggressive accounts payable policies?",
    "options": [
      "Loss of supplier goodwill",
      "Increased inventory costs",
      "Higher interest expenses",
      "Reduced sales volume"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Delaying payments excessively can damage relationships and reduce supplier goodwill."
  },
  {
    "id": 436,
    "question": "How can a company maintain liquidity while undertaking rapid growth without raising additional equity?",
    "options": [
      "By increasing accounts receivable days",
      "By reducing inventory and extending payables",
      "By decreasing payables period",
      "By reducing credit sales"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Reducing inventory and extending payables delays cash outflows and frees up cash for growth."
  },
  {
    "id": 437,
    "question": "What is the principal limitation of using the current ratio alone to assess a company’s liquidity?",
    "options": [
      "It ignores the timing of cash flows",
      "It includes intangible assets",
      "It excludes inventories",
      "It only measures profitability"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "The current ratio does not consider when assets convert to cash, which is crucial for liquidity."
  },
  {
    "id": 438,
    "question": "Which technique allows a company to monitor its daily cash position and forecast short-term liquidity needs accurately?",
    "options": [
      "Cash budgeting",
      "Budget variance analysis",
      "Ratio analysis",
      "Capital budgeting"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Cash budgeting tracks expected daily inflows and outflows to anticipate cash shortages or surpluses."
  },
  {
    "id": 439,
    "question": "How does a negative working capital cycle sometimes indicate a competitive advantage?",
    "options": [
      "When the company collects cash from customers before paying suppliers",
      "When the company has no inventory",
      "When accounts payable exceed long-term debt",
      "When profit margins are very high"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A negative working capital cycle means cash is received before it must be paid out, improving liquidity and operational efficiency."
  },
  {
    "id": 440,
    "question": "Which of the following best explains why increasing the inventory turnover ratio might not always be beneficial?",
    "options": [
      "It can increase stockouts and lost sales",
      "It always leads to higher storage costs",
      "It decreases sales volume",
      "It increases accounts payable days"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Excessive turnover can lead to insufficient stock levels, causing stockouts and lost sales opportunities."
  },
  {
    "id": 441,
    "question": "A company that uses an aggressive collection policy is likely to experience:",
    "options": [
      "Decreased bad debts but potentially lower sales",
      "Increased bad debts and higher sales",
      "Longer receivables days",
      "Improved supplier relationships"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Aggressive collection reduces credit risk but may alienate customers and reduce sales volume."
  },
  {
    "id": 442,
    "question": "Which of the following is true about the relationship between cash flow and profitability?",
    "options": [
      "Profitability always guarantees positive cash flow",
      "Cash flow and profitability are the same",
      "Profitability does not necessarily mean positive cash flow",
      "Cash flow ignores operating costs"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "A business can be profitable on paper but face negative cash flow due to timing differences in cash inflows and outflows."
  },
  {
    "id": 443,
    "question": "Which statement best describes a company’s operating cycle?",
    "options": [
      "Time from cash collection to inventory purchase",
      "Time from inventory purchase to cash collection",
      "Time from supplier payment to customer payment",
      "Time to pay long-term debt"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "The operating cycle measures the time taken from purchasing inventory until collecting cash from sales."
  },
  {
    "id": 444,
    "question": "What is the effect of offering extended credit terms to customers on cash flow and sales volume?",
    "options": [
      "Improves cash flow but lowers sales",
      "Worsens cash flow but may increase sales",
      "Improves both cash flow and sales",
      "No effect on cash flow or sales"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Longer credit terms delay cash inflows, worsening cash flow, but may boost sales volume by attracting more customers."
  },
  {
    "id": 445,
    "question": "Which financial ratio measures how efficiently a company uses its assets to generate sales?",
    "options": [
      "Current ratio",
      "Asset turnover ratio",
      "Debt-to-equity ratio",
      "Profit margin"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Asset turnover ratio evaluates how well assets are utilized to produce revenue."
  },
  {
    "id": 446,
    "question": "In a scenario of tightening liquidity, what is the most appropriate management action?",
    "options": [
      "Increase inventory levels",
      "Delay payments to suppliers as long as possible",
      "Speed up collections and reduce inventory",
      "Extend credit terms to customers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Accelerating collections and lowering inventory free up cash and improve liquidity."
  },
  {
    "id": 447,
    "question": "What is a disadvantage of relying heavily on short-term borrowing to finance working capital?",
    "options": [
      "Lower interest costs",
      "Reduced risk of insolvency",
      "Vulnerability to refinancing risk and interest rate fluctuations",
      "Improved supplier relationships"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Short-term borrowing exposes the company to risks if credit markets tighten or rates increase."
  },
  {
    "id": 448,
    "question": "Why might a company accept a lower profit margin on sales paid in cash versus sales on credit?",
    "options": [
      "Cash sales are riskier",
      "Cash sales improve liquidity and reduce collection costs",
      "Credit sales have lower operational costs",
      "Cash sales increase accounts receivable"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Cash sales provide immediate funds and reduce collection costs, often justifying a lower margin."
  },
  {
    "id": 449,
    "question": "Which cash flow activity category does interest paid on loans belong to under IFRS?",
    "options": [
      "Operating activities",
      "Investing activities",
      "Financing activities",
      "Non-cash activities"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Under IFRS, interest paid is generally classified as an operating cash flow."
  },
  {
    "id": 450,
    "question": "Which of the following strategies is LEAST effective for improving cash flow in a seasonal business?",
    "options": [
      "Negotiating extended payment terms with suppliers",
      "Securing a revolving credit facility",
      "Increasing inventory before peak season",
      "Offering early payment discounts to customers"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.3",
    "explanation": "Increasing inventory ties up cash before sales, which can worsen cash flow in seasonal businesses."
  },
  {
    "id": 451,
    "question": "Which of the following payment collection methods involves a physical document with a future payment order that can be legally discounted?",
    "options": [
      "Transference",
      "Bill of exchange",
      "Promissory Note",
      "Virtual POS"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "A Bill of Exchange is a physical document representing a future payment order and has legal guarantees; it can be discounted."
  },
  {
    "id": 452,
    "question": "What is a key difference between crowdfunding based on rewards and crowdfunding based on shares (crowdequity)?",
    "options": [
      "Rewards crowdfunding requires investors to provide collateral.",
      "Crowdequity involves structured business plans and investor selection.",
      "Reward crowdfunding offers equity stakes to contributors.",
      "Crowdequity has no follow-up requirements after funding."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Crowdequity requires a structured business plan and investor selection, unlike rewards crowdfunding which offers products or services without equity."
  },
  {
    "id": 453,
    "question": "Which source of startup financing is characterized by no scheduled repayments and shared control of the business?",
    "options": [
      "Personal Savings",
      "Equity from founders",
      "Bank loans",
      "Trade credit"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Equity investment from founders involves personal investment with no scheduled repayments and shared control among shareholders."
  },
  {
    "id": 454,
    "question": "Why is venture capital considered advantageous for startups compared to traditional debt financing?",
    "options": [
      "VCs require collateral and immediate repayment.",
      "VCs provide long-term capital without repayment schedules and add management expertise.",
      "VC investments always limit the startup's growth potential.",
      "VC investors typically avoid involvement in business strategy."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "VCs invest long-term capital without repayment schedules and often provide expertise and strategic support to startups."
  },
  {
    "id": 455,
    "question": "Which of the following best describes the role of 'confirming' in payment collection methods?",
    "options": [
      "It is a bank order to debit a customer's account immediately.",
      "It is a service where the creditor can anticipate payment risk transfer to the issuing bank.",
      "It is a virtual online payment platform for e-commerce transactions.",
      "It is a physical document similar to a check for immediate collection."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "'Confirming' is a financial payment management service allowing creditors to anticipate payments and transfer risk to the issuing bank."
  },
  {
    "id": 456,
    "question": "In the fundraising process, why is the 'pre-money' valuation important during the preparation stage?",
    "options": [
      "It defines the future market value after investment.",
      "It is the startup’s valuation before receiving new capital.",
      "It refers to the amount of debt the company must repay.",
      "It is the cost of marketing campaigns during crowdfunding."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "'Pre-money' valuation refers to the company's valuation before the injection of new capital, crucial for negotiating equity stakes."
  },
  {
    "id": 457,
    "question": "What distinguishes microcredit Credit B from Credit A according to the summary?",
    "options": [
      "Credit B is aimed at established corporations, Credit A at individuals.",
      "Credit B has a lower maximum amount and targets unemployed or young entrepreneurs.",
      "Credit A requires no financial solvency demonstration, Credit B does.",
      "Credit B offers larger loans than Credit A."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Credit B targets unemployed, young entrepreneurs or immigrants with a maximum of EUR 15,000, while Credit A is for self-employed and entrepreneurs with up to EUR 25,000."
  },
  {
    "id": 458,
    "question": "What is a key risk associated with bootstrapping as a startup financing method?",
    "options": [
      "Excessive outside investor control",
      "Threat of undercapitalization",
      "High interest repayment obligations",
      "Long legal procedures"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Bootstrapping, mainly using personal savings and low-cost methods, carries the risk of undercapitalization which can limit growth."
  },
  {
    "id": 459,
    "question": "Which financing method involves selling accounts receivable to a specialized institution in exchange for immediate partial payment?",
    "options": [
      "Factoring",
      "Asset Based Lending",
      "Purchase Order Finance",
      "Trade Credit"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Factoring is a mechanism where a factor buys accounts receivable, paying a portion upfront and collecting from customers later."
  },
  {
    "id": 460,
    "question": "Why might a startup consider accelerators as a source of financing and support?",
    "options": [
      "They provide unlimited funding for startups.",
      "They offer intensive structured development programs and seed capital, attracting further investors.",
      "They guarantee immediate loan repayment plans.",
      "They only serve established businesses."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Accelerators offer intensive development programs plus small seed capital, helping startups grow and attract future investors."
  },
  {
    "id": 461,
    "question": "In venture capital investment stages, what is the primary purpose of the due diligence process?",
    "options": [
      "To finalize the business plan by the entrepreneur.",
      "To verify legal, fiscal, administrative, and sometimes technological documentation of the startup.",
      "To publicly announce the startup’s launch.",
      "To negotiate marketing campaigns."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Due diligence allows the investor to thoroughly check the startup’s legal, fiscal, administrative, and sometimes technological status before finalizing the investment."
  },
  {
    "id": 462,
    "question": "Which characteristic best applies to equity capital invested by business angels?",
    "options": [
      "Large amounts invested at a late stage.",
      "Small to moderate amounts at early stages, often seed capital.",
      "Debt financing with fixed repayment schedules.",
      "Only invested in established, low-risk firms."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Business Angels usually provide smaller amounts of finance at early startup stages, commonly seed capital."
  },
  {
    "id": 463,
    "question": "What is the main difference between a traditional bank loan and asset-based lending?",
    "options": [
      "Traditional loans are always unsecured; asset-based loans require collateral.",
      "Asset-based lending uses company assets as primary repayment sources, less dependent on creditworthiness.",
      "Bank loans are only short-term; asset-based lending is always long-term.",
      "Asset-based lending is only for real estate."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Asset-based lending is secured by company assets and the loan amount depends on asset value rather than creditworthiness."
  },
  {
    "id": 464,
    "question": "What is a primary reason family and friends are considered potential investors in startups?",
    "options": [
      "They always provide large capital sums.",
      "They usually demand immediate repayment.",
      "They are easier to negotiate with and help attract other investors despite modest capital.",
      "They operate formal venture capital funds."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Family and friends tend to be easier to negotiate with and their involvement can attract additional investors, although the capital is often modest."
  },
  {
    "id": 465,
    "question": "Which crowdfunding model requires the preparation of a marketing campaign lasting 4-6 months and often using English language on the platform?",
    "options": [
      "Donation-based crowdfunding",
      "Reward-based crowdfunding",
      "Crowdequity (shares-based crowdfunding)",
      "Crowdlending"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Reward-based crowdfunding requires careful planning of marketing campaigns, often lasting several months, and frequently demands English communication on platforms."
  },
  {
    "id": 466,
    "question": "What is the main benefit of leasing as a bootstrap financing mechanism for startups?",
    "options": [
      "Requires full upfront payment for assets.",
      "Reduces long-term capital needs and improves cash flow without down payment.",
      "Transfers ownership immediately to the lessee.",
      "Has no impact on cash flow."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Leasing allows startups to use expensive assets while spreading out payments over time, reducing upfront capital requirements and improving cash flow."
  },
  {
    "id": 467,
    "question": "In the context of venture capital investor profiles, what is a significant concern when dealing with industrial VC partners?",
    "options": [
      "They only invest in unrelated sectors.",
      "They always impose short-term exit strategies.",
      "Their presence may discourage other investors due to competition or strategic conflicts.",
      "They never provide any strategic help."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Industrial VC investors may dissuade other investors due to their sector involvement and potential competitive conflicts."
  },
  {
    "id": 468,
    "question": "Which stage in venture capital investment is primarily managed by the entrepreneur and involves preparing the business plan and valuation?",
    "options": [
      "Prospection",
      "Negotiation",
      "Preparation of the operation",
      "Closure of the operation"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "The entrepreneur runs the preparation stage, developing business plans, valuation (pre-money), and gathering necessary documentation."
  },
  {
    "id": 469,
    "question": "Which of the following best describes trade credit as a financing method?",
    "options": [
      "A short-term loan backed by property collateral.",
      "Credit extended to sustain import/export activities, often via documentary credits or letters of credit.",
      "Investment by family and friends in startup equity.",
      "Venture capital funding for early-stage startups."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Trade credit in import/export often involves documentary credits, letters of credit, or confirmed letters of credit to ensure payment."
  },
  {
    "id": 470,
    "question": "Why might venture capital investors impose strict conditions on startup entrepreneurs during negotiation?",
    "options": [
      "To increase their own share value and control over exit decisions.",
      "Because they provide non-repayable grants.",
      "Because entrepreneurs always have excess capital.",
      "To discourage other investors."
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "VC investors seek to maximize return by gaining significant control, including exit decisions, to protect their investment."
  },
   {
    "id": 471,
    "question": "What is the primary characteristic of mezzanine financing in startup capital structure?",
    "options": [
      "It is a form of equity with voting rights only.",
      "It combines features of debt and equity, often convertible to shares.",
      "It is a government grant with no repayment.",
      "It is a short-term loan with high interest rates."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Mezzanine financing is hybrid capital combining debt and equity features, frequently convertible into equity shares."
  },
  {
    "id": 472,
    "question": "Which of the following is a key advantage of issuing convertible bonds for startups?",
    "options": [
      "They immediately dilute founders’ equity.",
      "They provide debt financing that can later convert to equity, delaying dilution.",
      "They are non-repayable grants.",
      "They guarantee fixed dividends to bondholders."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Convertible bonds start as debt but can convert to equity later, allowing startups to delay equity dilution."
  },
  {
    "id": 473,
    "question": "What role does a 'lead investor' typically play in a venture capital round?",
    "options": [
      "Provides the smallest amount of capital in the round.",
      "Coordinates due diligence and leads negotiations with other investors.",
      "Only invests after the round closes.",
      "Acts as a silent partner with no involvement."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "The lead investor spearheads due diligence, valuation negotiation, and coordinates the syndicate of investors."
  },
  {
    "id": 474,
    "question": "Which statement best describes the SAFE (Simple Agreement for Future Equity) instrument?",
    "options": [
      "A loan requiring immediate repayment.",
      "An agreement allowing investors to convert investment to equity at a future financing round without setting a valuation now.",
      "A traditional equity share certificate.",
      "A form of government subsidy."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "SAFE allows early investors to convert investments into equity during future priced rounds, postponing valuation decisions."
  },
  {
    "id": 475,
    "question": "In crowdfunding, what does 'all-or-nothing' funding mean?",
    "options": [
      "Funds are collected regardless of whether the goal is met.",
      "Funds are only collected if the campaign reaches its funding target.",
      "Investors receive equity regardless of outcome.",
      "Funds are immediately refunded after the campaign."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "'All-or-nothing' means that funds are only collected if the campaign hits or exceeds its funding goal."
  },
  {
    "id": 476,
    "question": "Which financial metric is most relevant when a startup negotiates a valuation based on expected future profits?",
    "options": [
      "EBITDA",
      "Net Book Value",
      "Current Assets",
      "Liquidity Ratio"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) is often used to value startups based on profit potential."
  },
  {
    "id": 477,
    "question": "Why do venture capitalists prefer startups with a scalable business model?",
    "options": [
      "Because scalability guarantees immediate profits.",
      "Because scalable models can grow revenues quickly without proportional increases in costs.",
      "Because scalability reduces market risk to zero.",
      "Because only scalable startups are legally allowed to receive VC funding."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Scalable models enable rapid growth in revenue with relatively low incremental costs, increasing potential returns."
  },
  {
    "id": 478,
    "question": "What is the main purpose of an exit strategy for venture capital investors?",
    "options": [
      "To immediately liquidate the startup’s assets.",
      "To define how investors will eventually realize returns by selling shares or IPO.",
      "To prevent any new investors from entering.",
      "To stop the startup from growing further."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Exit strategies allow VCs to plan how and when to monetize their investment via sale or public offering."
  },
  {
    "id": 479,
    "question": "Which of the following best describes 'bootstrapping' in startup financing?",
    "options": [
      "Using external venture capital funds.",
      "Funding a startup solely through internal cash flow and personal savings.",
      "Raising capital from angel investors.",
      "Receiving government grants."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Bootstrapping refers to financing growth using personal savings or business revenue without external investors."
  },
  {
    "id": 480,
    "question": "What is a common characteristic of ‘business angels’ as investors?",
    "options": [
      "They invest large sums during late-stage rounds.",
      "They are usually experienced entrepreneurs investing their own money early in startups.",
      "They provide only loans with fixed interest.",
      "They typically avoid involvement in business decisions."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Business angels are often successful entrepreneurs investing personal funds early and offering mentorship."
  },
  {
    "id": 481,
    "question": "How does factoring improve a startup’s cash flow?",
    "options": [
      "By delaying invoice payments.",
      "By selling accounts receivable to a third party for immediate cash.",
      "By increasing the startup’s debt levels.",
      "By securing long-term bank loans."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Factoring provides immediate liquidity by converting accounts receivable into cash."
  },
  {
    "id": 482,
    "question": "What distinguishes equity crowdfunding from reward-based crowdfunding?",
    "options": [
      "Equity crowdfunding involves giving rewards, reward-based gives shares.",
      "Equity crowdfunding grants shares in the company to contributors; reward-based offers products or perks.",
      "Reward-based crowdfunding requires formal due diligence.",
      "Equity crowdfunding has no legal regulation."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Equity crowdfunding gives investors ownership stakes; reward crowdfunding offers non-financial incentives."
  },
  {
    "id": 483,
    "question": "Which of these best explains the concept of a 'valuation cap' in convertible notes or SAFEs?",
    "options": [
      "It sets a maximum valuation at which the investment converts to equity.",
      "It guarantees a minimum return on investment.",
      "It limits how much capital a startup can raise.",
      "It sets the maximum debt a startup can incur."
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "A valuation cap protects early investors by capping the conversion price in future equity rounds."
  },
  {
    "id": 484,
    "question": "What is an advantage of using government-backed microcredits for startups?",
    "options": [
      "They require high collateral and strict credit history.",
      "They facilitate access to financing for individuals with limited creditworthiness.",
      "They are only available to large corporations.",
      "They require immediate repayment within one month."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Microcredits aim to support entrepreneurs who lack traditional collateral or credit histories."
  },
  {
    "id": 485,
    "question": "Why is the timing of capital injection important in a startup's life cycle?",
    "options": [
      "Because early capital injections always result in no dilution.",
      "Because funding at key growth stages ensures operational needs and market expansion without premature dilution.",
      "Because late capital injections are legally prohibited.",
      "Because timing has no impact on ownership structure."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Capital injections timed for growth stages help startups scale while managing dilution and financial health."
  },
  {
    "id": 486,
    "question": "What is a common reason startups use leasing as a financing option for equipment?",
    "options": [
      "Leasing requires immediate full payment for equipment.",
      "Leasing spreads equipment costs over time, preserving working capital.",
      "Leasing always transfers ownership immediately.",
      "Leasing increases upfront capital needs."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Leasing reduces upfront expenditure by spreading payments, helping preserve cash flow."
  },
  {
    "id": 487,
    "question": "What distinguishes venture capital funds from business angels?",
    "options": [
      "VC funds invest their own personal money, angels manage pooled funds.",
      "VC funds manage pooled investments from many investors, while angels invest their personal funds.",
      "VC funds only invest in debt instruments.",
      "Angels require no return on investment."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Venture capital funds pool money from multiple investors; business angels invest their own capital."
  },
  {
    "id": 488,
    "question": "What is the typical impact of venture capital on startup management?",
    "options": [
      "VC involvement usually reduces operational guidance.",
      "VCs often demand active participation in strategic decisions and board representation.",
      "VCs require startups to abandon their business plan.",
      "VCs impose no conditions on startup governance."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "VCs commonly seek active roles in governance to protect their investment and guide growth."
  },
  {
    "id": 489,
    "question": "Why do startups often prefer equity financing over debt financing?",
    "options": [
      "Equity financing requires fixed repayments.",
      "Equity financing does not require immediate repayment and shares risk with investors.",
      "Debt financing never requires collateral.",
      "Equity financing limits future fundraising."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Equity financing avoids fixed debt repayments and shares financial risk with investors."
  },
   {
    "id": 490,
    "question": "What is a common purpose of a 'due diligence' process in startup investments?",
    "options": [
      "To delay the funding round indefinitely.",
      "To thoroughly evaluate the startup's financials, market, and risks before investing.",
      "To guarantee the startup’s success.",
      "To determine the startup’s customer base."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Due diligence involves careful assessment of all critical aspects before an investment decision."
  },
  {
    "id": 491,
    "question": "Which type of investor is most likely to invest during a startup’s seed funding stage?",
    "options": [
      "Private equity funds",
      "Business angels",
      "Initial Public Offering (IPO) investors",
      "Mutual funds"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Business angels typically provide early seed funding to startups."
  },
  {
    "id": 492,
    "question": "What does the 'burn rate' indicate in a startup?",
    "options": [
      "The rate at which the startup generates profit.",
      "The speed at which the startup spends its available cash.",
      "The number of products sold monthly.",
      "The speed of customer acquisition."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Burn rate is the rate at which a startup consumes cash to cover expenses."
  },
  {
    "id": 493,
    "question": "Which of the following is a typical feature of venture capital funding?",
    "options": [
      "Long-term investment with active involvement in the company.",
      "Short-term loan with no equity participation.",
      "Government grant without repayment.",
      "Crowdfunding from many small investors."
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Venture capital usually implies long-term equity investments with active investor participation."
  },
  {
    "id": 494,
    "question": "What does the term 'liquidity event' refer to in startup financing?",
    "options": [
      "An event where a startup issues more debt.",
      "An event such as an IPO or acquisition that allows investors to sell their shares.",
      "An event where the startup runs out of cash.",
      "An internal audit of financial statements."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Liquidity events let investors convert equity into cash by selling shares publicly or to buyers."
  },
  {
    "id": 495,
    "question": "Which statement best describes the role of a 'term sheet' in venture capital?",
    "options": [
      "It is a binding contract to invest immediately.",
      "It is a non-binding document outlining the basic terms and conditions of an investment.",
      "It guarantees a startup’s valuation.",
      "It forbids startups from raising further capital."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "A term sheet sets out proposed investment terms but is typically non-binding until final contracts."
  },
  {
    "id": 496,
    "question": "Which financial instrument allows investors to provide capital without immediately determining a startup’s valuation?",
    "options": [
      "Convertible notes",
      "Equity shares",
      "Bank loans",
      "Revenue-based financing"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Convertible notes delay valuation by converting to equity during a future priced round."
  },
  {
    "id": 497,
    "question": "What is the main risk for investors when providing debt financing to startups?",
    "options": [
      "High risk of losing voting control.",
      "Risk of default if the startup cannot repay the loan.",
      "Risk of equity dilution.",
      "Risk of immediate liquidation."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Debt financing entails risk of default if the startup cannot meet repayment obligations."
  },
  {
    "id": 498,
    "question": "Why is diversification important for venture capital firms?",
    "options": [
      "To invest all funds in one startup for maximum impact.",
      "To spread risk across multiple startups, reducing impact of failure.",
      "To focus only on startups in one industry.",
      "To guarantee success of every investment."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Diversification reduces risk by spreading investments over various startups and sectors."
  },
  {
    "id": 499,
    "question": "What distinguishes revenue-based financing from traditional equity financing?",
    "options": [
      "Investors receive a percentage of revenue until a cap is reached instead of equity shares.",
      "Investors become board members immediately.",
      "Investors acquire full ownership.",
      "Startups must repay with fixed monthly installments."
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "4.4",
    "explanation": "Revenue-based financing returns investor capital as a percentage of revenue until a predefined amount is paid, not equity."
  },
  {
  "id": 500,
  "question": "What is the primary objective of an exit strategy for startup investors?",
  "options": [
    "To increase the startup’s daily operations efficiency.",
    "To plan how investors will realize returns by selling their shares.",
    "To prevent the startup from seeking additional funding.",
    "To avoid paying taxes on profits."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "4.4",
  "explanation": "An exit strategy outlines how investors will liquidate their holdings to realize gains."
},
{
    "id": 501,
    "question": "What distinguishes a commercial company from a civil company?",
    "options": [
      "Commercial companies have no profit-making intention.",
      "Civil companies pursue profit-making intention.",
      "Commercial companies pursue profit-making intention.",
      "Civil companies operate internationally."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Commercial companies have the intention to make a profit, while civil companies do not, focusing instead on moral compensation."
  },
  {
    "id": 502,
    "question": "Which classification of companies is based on the number of employees?",
    "options": [
      "Legal form",
      "Size",
      "Sector",
      "Property"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Size classification categorizes companies as small (up to 50 employees), medium (50-250), or large (more than 250 employees)."
  },
  {
    "id": 503,
    "question": "What is an example of a primary sector activity?",
    "options": [
      "Manufacturing electronics",
      "Agriculture",
      "Retail stores",
      "Banking services"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The primary sector involves activities like agriculture and fishing, with little or no transformation of products."
  },
  {
    "id": 504,
    "question": "In terms of legal liability, what does 'limited liability' mean?",
    "options": [
      "Shareholders are responsible for all company debts with personal assets.",
      "Shareholders are only responsible for company debts up to their contributed sums.",
      "The company is fully liable for shareholder debts.",
      "No liability applies to shareholders."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Limited liability means shareholders risk only the money they invested, not their personal assets."
  },
  {
    "id": 505,
    "question": "What distinguishes a public property company from a private property company?",
    "options": [
      "Public companies are owned by private individuals.",
      "Private companies are owned and managed by the government.",
      "Public companies are owned and managed by a public entity.",
      "There is no difference."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Public companies belong to the public sector, with ownership and management by the state or government entities."
  },
  {
    "id": 506,
    "question": "Which integration level groups firms performing the same productive process?",
    "options": [
      "Vertical integration",
      "Horizontal integration",
      "Territorial integration",
      "Functional integration"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Horizontal integration groups companies in the same productive stage to increase scale and reduce competition."
  },
  {
    "id": 507,
    "question": "Which business classification refers to a business operating only within one city or town?",
    "options": [
      "Regional",
      "Local",
      "National",
      "Multinational"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "A local business operates in a single town or city."
  },
  {
    "id": 508,
    "question": "How is self-employment typically distinguished from freelance activity?",
    "options": [
      "Self-employed workers never own a business.",
      "Freelancers always have employees.",
      "Self-employed business includes self-employed workers and company directors without employees.",
      "Freelance means owning a limited company."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Self-employed businesses consist of independent workers and company directors who do not employ others."
  },
  {
    "id": 509,
    "question": "Which is a key characteristic of a sole proprietorship?",
    "options": [
      "Owned by multiple partners.",
      "Owner has unlimited personal liability.",
      "Profits are taxed at the corporate rate.",
      "Ownership is shared with investors."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "In a sole proprietorship, one person owns the business and is personally liable for all debts."
  },
  {
    "id": 510,
    "question": "In a partnership, how are taxes generally applied?",
    "options": [
      "The partnership pays corporate taxes.",
      "Partners pay personal income taxes on their share of profits.",
      "The business pays no taxes.",
      "Only the managing partner pays taxes."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Partners pay personal income tax on their share of profits; the partnership itself is not taxed separately."
  },
  {
    "id": 511,
    "question": "What is a main advantage of a corporation compared to other business forms?",
    "options": [
      "Unlimited liability for owners.",
      "Easier access to financing and limited liability.",
      "No need for formal governance.",
      "Owner has full control without board of directors."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Corporations offer limited liability to shareholders and better access to capital markets."
  },
  {
    "id": 512,
    "question": "What defines a cooperative business?",
    "options": [
      "Owned by investors focused on profit only.",
      "Owned and controlled by those who use its services.",
      "A legal entity separate from its members.",
      "Operates exclusively for charitable purposes."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Cooperatives are owned and managed by members who benefit from its services."
  },
  {
    "id": 513,
    "question": "Which legal form is most common in Spain for limited liability companies?",
    "options": [
      "Sociedad Anónima (S.A.)",
      "Sociedad Limitada Nueva Empresa (SLNE)",
      "Sociedad Limitada (S.L.)",
      "European Company (SE)"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The Sociedad Limitada (S.L.) is the most commonly used limited liability company form in Spain."
  },
  {
    "id": 514,
    "question": "Which of these is NOT a characteristic of a start-up company in Spain?",
    "options": [
      "No more than five years old.",
      "Has a scalable and innovative model.",
      "Is listed on the stock exchange.",
      "Annual turnover under ten million euros."
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Start-ups are not listed on the stock exchange."
  },
  {
    "id": 515,
    "question": "What tax rate applies to start-ups in Spain while the start-up status is maintained?",
    "options": [
      "25% Corporate Income Tax rate",
      "15% Corporate Income Tax rate",
      "30% Personal Income Tax rate",
      "0% tax rate"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Start-ups benefit from a reduced corporate income tax rate of 15% for up to four years."
  },
  {
    "id": 516,
    "question": "What is the main benefit of the new visa for digital nomads in Spain?",
    "options": [
      "Unlimited duration stay.",
      "Pay non-resident income tax instead of personal income tax.",
      "Requires investment in local businesses.",
      "Only valid for citizens of the EU."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Digital nomads can pay non-resident income tax, which is often more favorable than regular personal income tax."
  },
  {
    "id": 517,
    "question": "How has the deduction percentage in Personal Income Tax (IRPF) for investing in start-ups changed?",
    "options": [
      "Increased from 30% to 50%",
      "Decreased from 50% to 30%",
      "Remained at 30%",
      "Is no longer available"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The law increased the deduction from 30% to 50% to encourage investment in start-ups."
  },
  {
    "id": 518,
    "question": "What is 'carried interest' in relation to investment companies?",
    "options": [
      "A tax credit given to start-ups.",
      "Return that investment companies earn from their management success, taxed at 50%.",
      "A form of salary paid to employees.",
      "A penalty for failed investments."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "'Carried interest' is the profit share earned by investment companies, taxed favorably at 50%."
  },
  {
    "id": 519,
    "question": "What is the main purpose of controlled test environments ('sandboxes') for start-ups?",
    "options": [
      "To accelerate financial audits.",
      "To test innovations’ viability and impact before market launch.",
      "To control competitors’ access to new technologies.",
      "To standardize tax compliance."
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Sandboxes allow start-ups to test new technologies and innovations in a controlled setting."
  },
  {
    "id": 520,
    "question": "Which of the following is NOT a main industry for start-ups according to the summary?",
    "options": [
      "Automobile",
      "Construction",
      "Fast-food restaurants",
      "Heavy mining"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Heavy mining is not listed among the main industries for start-ups in the provided summary."
  },
   {
    "id": 521,
    "question": "Which is considered an external factor that can cause a crisis in a business?",
    "options": [
      "Cash flow problems",
      "Economic downturn",
      "Poor management decisions",
      "Employee dissatisfaction"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Economic downturns are external factors impacting businesses beyond their control."
  },
  {
    "id": 522,
    "question": "What is a key feature of a cooperative business?",
    "options": [
      "Profit distribution based on capital invested",
      "Owned and democratically controlled by its members",
      "Unlimited liability for members",
      "Run by a single owner"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Cooperatives are member-owned organizations with democratic control."
  },
  {
    "id": 523,
    "question": "What distinguishes a non-profit organization from a commercial business?",
    "options": [
      "Focus on providing public or social benefit rather than profit",
      "Always government-funded",
      "Limited liability of members",
      "Unlimited liability of members"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Non-profits prioritize social or public benefit rather than profit generation."
  },
  {
    "id": 524,
    "question": "What is the legal document that creates a company called?",
    "options": [
      "Partnership agreement",
      "Articles of incorporation",
      "Business plan",
      "Memorandum of understanding"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The articles of incorporation are the official documents registering a company."
  },
  {
    "id": 525,
    "question": "Which business type has the easiest transfer of ownership?",
    "options": [
      "Sole proprietorship",
      "Partnership",
      "Corporation",
      "Cooperative"
    ],
    "correctAnswer": 2,
    "subject": "economy",
        "topic": "5.0",
    "explanation": "Corporations have shares that can be easily transferred, unlike sole proprietorships or partnerships."
  },
  {
    "id": 526,
    "question": "Which of the following is NOT a requirement for a start-up under Spanish law?",
    "options": [
      "Being less than 5 years old",
      "Having an annual turnover under 10 million euros",
      "Being listed on the stock exchange",
      "Innovative or scalable business model"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Start-ups are not required or expected to be publicly listed companies."
  },
  {
    "id": 527,
    "question": "In a limited liability company, who is responsible for company debts?",
    "options": [
      "Only the company assets",
      "Shareholders’ personal assets",
      "The government",
      "The employees"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "In limited liability companies, liability is limited to company assets only."
  },
  {
    "id": 528,
    "question": "Which tax benefit applies to the first four years of a start-up’s life in Spain?",
    "options": [
      "Reduced VAT rate",
      "Reduced corporate tax rate of 15%",
      "Exemption from income tax",
      "Exemption from social security contributions"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Start-ups benefit from a reduced corporate tax rate of 15% for up to four years."
  },
  {
    "id": 529,
    "question": "Which is NOT a characteristic of franchising?",
    "options": [
      "Franchisee pays royalties",
      "Franchisor provides training and marketing support",
      "Franchisee owns the entire brand",
      "Franchisee operates under franchisor’s system"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Franchisees do not own the brand; the franchisor retains brand ownership."
  },
  {
    "id": 530,
    "question": "Which growth strategy involves merging with or acquiring other companies?",
    "options": [
      "Internal growth",
      "External growth",
      "Licensing",
      "Franchising"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "External growth involves mergers and acquisitions."
  },
  {
    "id": 531,
    "question": "What is a joint venture?",
    "options": [
      "A merger of two companies into one",
      "Two or more companies collaborating on a project while remaining independent",
      "One company buying another",
      "A franchise agreement"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "A joint venture is a cooperative project between companies without merging."
  },
  {
    "id": 532,
    "question": "Which of these is a common disadvantage of sole proprietorships?",
    "options": [
      "Unlimited liability",
      "Difficulty in decision-making",
      "Double taxation",
      "Complex legal formalities"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Sole proprietors have unlimited liability for business debts."
  },
  {
    "id": 533,
    "question": "What does 'limited liability' mean for shareholders?",
    "options": [
      "They cannot sell their shares",
      "They are not personally responsible for company debts beyond their investment",
      "They must work for the company",
      "They pay personal income tax on company profits"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Limited liability protects shareholders from personal responsibility beyond their investment."
  },
  {
    "id": 534,
    "question": "Which sector of the economy includes services such as education and healthcare?",
    "options": [
      "Primary",
      "Secondary",
      "Tertiary",
      "Quaternary"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The tertiary sector covers services like education, healthcare, and retail."
  },
  {
    "id": 535,
    "question": "Which is a characteristic of a public limited company (PLC)?",
    "options": [
      "Shares are publicly traded",
      "Only one owner",
      "No liability protection",
      "No need to publish financial reports"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "PLCs can sell shares to the public via stock exchanges."
  },
  {
    "id": 536,
    "question": "Which of the following is NOT an example of external business growth?",
    "options": [
      "Acquisitions",
      "Mergers",
      "Franchising",
      "Developing new products internally"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Developing new products internally is an internal growth strategy."
  },
  {
    "id": 537,
    "question": "Which legal form typically requires the most complex setup procedures?",
    "options": [
      "Sole proprietorship",
      "Partnership",
      "Corporation",
      "Cooperative"
    ],
    "correctAnswer": 2,
    "subject": "economy",
      "topic": "5.0",
    "explanation": "Corporations have the most legal formalities and regulatory requirements."
  },
  {
    "id": 538,
    "question": "What is the main goal of social entrepreneurship?",
    "options": [
      "Maximize profits",
      "Solve social problems sustainably",
      "Avoid taxes",
      "Expand market share"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Social entrepreneurship aims to create social value and impact."
  },
  {
    "id": 539,
    "question": "Which document governs the internal rules of a cooperative?",
    "options": [
      "Bylaws",
      "Articles of incorporation",
      "Franchise agreement",
      "Business plan"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Bylaws regulate the internal management and operations of a cooperative."
  },
  {
    "id": 540,
    "question": "What distinguishes a civil company from a commercial company?",
    "options": [
      "Civil companies pursue moral compensation, not profit",
      "Civil companies have more employees",
      "Civil companies pay more taxes",
      "Civil companies cannot be formed by individuals"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Civil companies generally pursue moral compensation and do not aim primarily for profit."
  },
  {
    "id": 541,
    "question": "In Spanish corporate law, what is the minimum capital requirement for forming a Sociedad Anónima (S.A.)?",
    "options": [
      "3,000 euros",
      "60,000 euros",
      "12,000 euros",
      "30,000 euros"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The minimum capital for a Sociedad Anónima is 60,000 euros, but 25% must be paid at incorporation, so 30,000 euros is the minimum paid up."
  },
  {
    "id": 542,
    "question": "Which of the following best describes the 'lifting of the corporate veil' in company law?",
    "options": [
      "The process of merging two companies into one",
      "Holding shareholders personally liable for company debts in specific cases",
      "A tax exemption applied to small companies",
      "The dissolution of a company after bankruptcy"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Lifting the corporate veil allows courts to hold shareholders personally liable when misuse or fraud occurs."
  },
  {
    "id": 543,
    "question": "What is the primary difference between a Sociedad Limitada (S.L.) and a Sociedad Anónima (S.A.) regarding shareholder liability and share transfer?",
    "options": [
      "S.L. has unlimited liability; S.A. has limited liability",
      "S.L. shares are freely transferable; S.A. shares require approval",
      "S.L. has limited liability and restricted share transfer; S.A. has limited liability and freely transferable shares",
      "S.L. is for public companies; S.A. is for private companies"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "S.L. limits share transfer to protect members, while S.A. allows free transfer of shares."
  },
  {
    "id": 544,
    "question": "Under the Spanish Law of Startups (Ley de Startups), which condition allows a company to benefit from tax incentives?",
    "options": [
      "Being headquartered in Madrid or Barcelona",
      "Having a turnover under 10 million euros and investing in R&D",
      "Being listed on the stock market",
      "Having over 100 employees"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Startups benefit from tax incentives when meeting turnover thresholds and investing in innovation."
  },
  {
    "id": 545,
    "question": "Which legal instrument in Spain facilitates the creation of a company through a single notarial act and electronic registration?",
    "options": [
      "Escritura pública de constitución",
      "Acta de junta general",
      "Sociedad Limitada de Formación Sucesiva",
      "Sociedad Limitada Nueva Empresa (SLNE)"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "SLNE simplifies company creation with electronic procedures and reduced capital requirements."
  },
  {
    "id": 546,
    "question": "What is a 'socio comanditario' in the context of a Sociedad Comanditaria in Spain?",
    "options": [
      "A limited partner with liability limited to their investment",
      "A managing partner with unlimited liability",
      "A silent partner with no voting rights",
      "A creditor of the company"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Socios comanditarios have limited liability and do not manage the company."
  },
  {
    "id": 547,
    "question": "In terms of corporate governance, what is the role of the 'Consejo de Administración' in Spanish corporations?",
    "options": [
      "To audit financial statements",
      "To manage and represent the company on behalf of shareholders",
      "To represent employees in corporate decisions",
      "To regulate market competition"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "The board of directors ('Consejo de Administración') manages and represents the company."
  },
  {
    "id": 548,
    "question": "What is the 'capital social suscrito y desembolsado' in Spanish corporate terminology?",
    "options": [
      "Total authorized capital without payment",
      "Capital subscribed by shareholders and actually paid",
      "Capital reserved for future expansion",
      "Capital allocated to dividends"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "It refers to the portion of capital shareholders have committed to and actually paid."
  },
  {
    "id": 549,
    "question": "Which of the following is NOT a reason for a company to be dissolved according to Spanish corporate law?",
    "options": [
      "Completion of the company’s purpose",
      "Shareholder unanimous decision",
      "Bankruptcy and insolvency",
      "Increase in capital stock"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Increasing capital stock does not cause dissolution; it is a growth activity."
  },
  {
    "id": 550,
    "question": "What is the main legal difference between 'Sociedad Civil' and 'Sociedad Mercantil' in Spain?",
    "options": [
      "Sociedad Civil is governed by civil law and not engaged in commercial activity, while Sociedad Mercantil is a commercial company governed by commercial law",
      "Sociedad Civil has limited liability, Sociedad Mercantil does not",
      "Sociedad Mercantil can only be formed by individuals, Sociedad Civil by companies",
      "Sociedad Civil must be publicly traded"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "5.0",
    "explanation": "Sociedad Civil is non-commercial and governed by civil law, while Sociedad Mercantil is commercial."
  },
  {
    "id": 551,
    "question": "What is the Lean Canvas used for?",
    "options": [
      "New businesses and ongoing businesses",
      "New businesses",
      "Ongoing businesses",
      "Human resources planning"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The Lean Canvas is a tool to design and validate business models, mainly aimed at new businesses."
  },
  {
    "id": 552,
    "question": "What is a business plan?",
    "options": [
      "A document that details a company's strategy, its objectives, and how it plans to achieve them",
      "A marketing plan to promote products and services",
      "An annual financial report of the company",
      "A document of internal human resources policies"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A business plan is a document that details the strategy, objectives, and how a company plans to achieve them."
  },
  {
    "id": 553,
    "question": "An idea is not always a business opportunity. The main characteristics of an opportunity are being:",
    "options": [
      "Conservative and logical",
      "Attractive, durable, and timely (taking advantage of a window in the market)",
      "Valuable to the customer and attractive",
      "Competitive, exclusive, and costly"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A business opportunity must be attractive, durable, and take advantage of a timely window in the market."
  },
  {
    "id": 554,
    "question": "What does market capitalization represent?",
    "options": [
      "The book value of the company's assets",
      "The total value of a company's shares",
      "The total long-term debt",
      "The value of retained earnings"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Market capitalization is the total value of all a company's shares in the market, calculated by multiplying the share price by the number of shares issued."
  },
  {
    "id": 555,
    "question": "Suppose you are reviewing the Balance Statement of a technology company called 'Tech Solutions.' You find the following: • Total assets: $800,000 • Total liabilities: $400,000 • Equity: ? Given this scenario, which of the following statements is true regarding 'Tech Solutions'?",
    "options": [
      "To calculate the net equity of 'Tech Solutions' I need to know the gross profit",
      "'Tech Solutions' equity is equal to the difference between its total assets and total liabilities",
      "'Tech Solutions' equity is greater than its liabilities",
      "None of the above"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Net equity is calculated by subtracting total liabilities from total assets. In this case, equity is $800,000 - $400,000 = $400,000."
  },
  {
    "id": 556,
    "question": "Which of the following options correctly lists the key characteristics of a good business opportunity?",
    "options": [
      "Attractive, Durable, Timely, Anchored in a Product or Service",
      "Valuable, Economical, Temporary, Alternative to the product",
      "Innovative, Exclusive, Temporary, Focused on technology",
      "Competitive, Sustainable, Flexible, Based on social networks"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The key characteristics of a good business opportunity are that it is attractive, durable, timely, and anchored in a product or service that adds value."
  },
  {
    "id": 557,
    "question": "What does 'pivot' mean in the context of a startup?",
    "options": [
      "Changing the target market due to lack of customers",
      "Substantially changing the business strategy based on learnings about the product or service",
      "Partially adapting your business model to respond to customer suggestions",
      "Maintaining the original strategy without changes"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Pivoting means significantly changing the business strategy based on what has been learned about the product or service to improve chances of success."
  },
  {
    "id": 558,
    "question": "What is the purpose of identifying Negative Buyer Personas?",
    "options": [
      "Increase sales to all potential customers",
      "Exclude customers who are not suitable for the company",
      "Expand segmentation to new unprofitable markets",
      "Identify only customers with the highest purchasing power"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Identifying Negative Buyer Personas helps exclude those customers who are not suitable for the company, avoiding wasted effort and resources."
  },
  {
    "id": 559,
    "question": "What is the main objective of the customer search section in a business plan?",
    "options": [
      "Analyze competition and potential market",
      "Define production cost structure",
      "Establish necessary human resources",
      "Understand pricing, promotion, distribution, and sales"
    ],
    "correctAnswer": 3,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The customer search section in a business plan focuses on understanding how pricing, promotion, distribution, and sales are set to reach and attract customers."
  },
  {
    "id": 560,
    "question": "A company generates sales revenues of 400,000 euros. Its manufacturing costs are 50,000 euros and labor costs are 90,000 euros. What is the company's gross margin?",
    "options": [
      "65%",
      "65.5%",
      "65.79%",
      "66%"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Gross margin is calculated as: Gross Margin = (Revenues - Direct Costs) / Revenues. Direct costs = 50,000 (manufacturing) + 90,000 (labor) = 140,000. Gross Margin = (400,000 - 140,000) / 400,000 = 260,000 / 400,000 = 0.65 = 65%. However, if labor costs were excluded, it would be 87.5%. In this case, labor costs are included, so the answer is approximately 65.79%."
  },
  {
    "id": 561,
    "question": "Why is it important to continuously test, iterate, and adjust the Value Proposition in the Lean Canvas during the startup development process?",
    "options": [
      "To keep focus on competitors and adapt to their strategies",
      "To ensure the company remains faithful to its original vision and does not change course",
      "To effectively respond to changing customer needs and maintain the product or service's relevance in the market",
      "To guarantee an aesthetic product design regardless of demand"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The Value Proposition in the Lean Canvas must be constantly adjusted to align with the real needs of customers. This iteration process allows the startup to adapt, learn from feedback, and create more relevant solutions, increasing the chances of market success."
  },
  {
    "id": 562,
    "question": "What is the main objective of launching a Minimum Viable Product (MVP) in the startup development process?",
    "options": [
      "Minimize production costs",
      "Validate critical business hypotheses with real customers and obtain quick feedback to iterate on the product",
      "Attract early investors by showing a fully developed product ready for market",
      "Present a final graphic design for advertising campaigns"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The goal of the MVP is to validate fundamental business model hypotheses with a basic version of the product, allowing rapid learning from customer behavior and needs without heavy initial investment."
  },
  {
    "id": 563,
    "question": "Which of the following best describes the function of Key Resources in a startup's Lean Canvas?",
    "options": [
      "Key Resources are physical assets like equipment and machinery needed for production",
      "Key Resources refer to the initial financing needed to launch the startup",
      "Key Resources can include tangible and intangible assets, technology, knowledge, relationships, and human capital",
      "Key Resources only include the business location"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Key Resources in the Lean Canvas are all essential elements for the business model to work. This includes both tangible assets (like technology or infrastructure) and intangible ones (knowledge, relationships, human capital, etc.)."
  },
  {
    "id": 564,
    "question": "What is the key difference between shareholders and stakeholders?",
    "options": [
      "Shareholders own debts; stakeholders own shares",
      "Shareholders own shares and have financial interest; stakeholders include all parties interested in or affected by the company",
      "Shareholders manage daily operations; stakeholders only invest money",
      "Shareholders are customers; stakeholders are employees"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Shareholders are those who own company shares and have a financial interest, while stakeholders include all people or groups affected by or interested in the company's operations, such as employees, customers, suppliers, community, and shareholders."
  },
 {
    "id": 565,
    "question": "An entrepreneur is characterized by:",
    "options": [
      "Leadership ability, being innovative, and participating in new markets",
      "Not taking risks, high technical knowledge, and business experience",
      "All of the above",
      "None of the above"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Entrepreneurs usually stand out for their leadership, creativity, and willingness to explore or create new markets. Taking risks is also a common characteristic, unlike option 2, which states the opposite."
  },
  {
    "id": 566,
    "question": "The main factors of production in a company are:",
    "options": [
      "Land, Labor, and Capital",
      "Money, Technology, and Innovation",
      "Income, Costs, and Human Capital",
      "Clients, Suppliers, and Patents"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The classic factors of production in economics are Land, Labor, and Capital. These represent the fundamental resources used in the production of goods and services."
  },
  {
    "id": 567,
    "question": "A company's fixed costs amount to 75,000 euros. The selling price per unit is 50 euros and the variable cost per unit is 30 euros. If the company wants to obtain a profit of 25,000 euros, how many units must it sell?",
    "options": [
      "4,000",
      "5,000",
      "4,500",
      "5,500"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "To calculate the number of units needed: (Fixed Costs + Desired Profit) / (Price per unit - Variable cost per unit) = (75,000 + 25,000) / (50 - 30) = 100,000 / 20 = 5,000 units."
  },
  {
    "id": 568,
    "question": "Which of the following options correctly corresponds to types of social entrepreneurship based on market impact and company mission?",
    "options": [
      "Traditional, Non-profit, Environmental, Hybrid",
      "Traditional, Social Purpose, Social Consequence, Non-profit Entrepreneur, Hybrid",
      "Social Purpose, Technological, Educational, Hybrid",
      "Social Purpose, Traditional, Competitive, Hybrid"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The most accepted types of social entrepreneurship include: Social Purpose (strong focus on a social cause), Social Consequence (has social impact although not the main mission), Non-profit entrepreneurship (no economic profit goal), and Hybrid (mix between social and economic focus)."
  },
  {
    "id": 569,
    "question": "If a company seeks to introduce a new product in a new market, it is following a strategy of:",
    "options": [
      "Intrapreneurship",
      "Market stability",
      "Total diversification",
      "Market penetration"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The total diversification strategy involves launching a new product in a completely new market for the company. It is the highest risk strategy according to Ansoff's matrix."
  },
  {
    "id": 570,
    "question": "Which is NOT an essential component of the structure of a Business Plan?",
    "options": [
      "Identification of the business opportunity",
      "Detailed description of organizational culture",
      "Competitor analysis and competitive strategy",
      "Five-year cash budget"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Although organizational culture can be relevant, it is not an essential or mandatory component in a standard business plan. Essentials include the business opportunity, competitive analysis, strategy, and financial projections."
  },
  {
    "id": 571,
    "question": "What does ROA (Return on Assets) measure?",
    "options": [
      "The company's short-term liquidity",
      "A company's profitability in relation to its total assets",
      "The debt-to-equity ratio",
      "Inventory management efficiency"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "ROA (Return on Assets) measures how profitable a company is based on the total of its assets, indicating how much profit is generated per monetary unit invested in assets."
  },
  {
    "id": 572,
    "question": "What is the main objective of the Management Team section in a complete business plan?",
    "options": [
      "Show financial results from the last year",
      "Describe strategic alliances with suppliers",
      "Present the organizational chart and team structure",
      "Detail the marketing and sales plan"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The Management Team section in a business plan is intended to present the team structure, including the organizational chart, key profiles, and management experience, which is crucial to build investor confidence and demonstrate executive capability."
  },
  {
    "id": 573,
    "question": "In Porter's Five Forces model, which scenario would most significantly increase the bargaining power of suppliers?",
    "options": [
      "The supplier offers volume discounts",
      "The supplier provides a highly specialized component",
      "The supplier has access to multiple distribution channels",
      "The supplier freely shares financial information"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "When a supplier provides a highly specialized component, switching costs for the buyer increase and there are fewer alternatives. This gives the supplier more bargaining power since the customer relies heavily on their unique offering."
  },
  {
    "id": 574,
    "question": "Which of the following best describes a Minimum Viable Product (MVP)?",
    "options": [
      "The final complete product version for investors",
      "A prototype without sales capability, only for design",
      "A basic version with essential features to test the business idea",
      "A theoretical model without a working prototype"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A Minimum Viable Product (MVP) is a basic version of a product that includes only the essential functions needed to validate a business hypothesis and get customer feedback with minimal effort and resources."
  },
  {
    "id": 575,
    "question": "Suppose you own a company. You have estimated your production quantities, calculated your fixed and variable costs, and determined that your Break Even Selling Price is $15. If you want to produce a new premium-design necklace costing more to make but in the same quantities, how is this expected to affect the Break Even Selling Price of your necklaces?",
    "options": [
      "The Break Even Selling Price will remain the same",
      "The Break Even Selling Price will increase",
      "The Break Even Selling Price will decrease",
      "None of the above"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "If production costs increase due to a premium design, and quantities remain constant, the break-even price will also increase to cover the higher variable costs and reach the break-even point."
  },
  {
    "id": 576,
    "question": "Which of the following costs is NOT considered when calculating operating profit?",
    "options": [
      "Raw material costs",
      "Labor costs",
      "Loan interest",
      "Administrative costs"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Operating profit is calculated before deducting loan interest, which corresponds to financial expenses. Therefore, interest is not included in the operating profit calculation."
  },
  {
    "id": 577,
    "question": "What is the main goal of Search Engine Optimization (SEO)?",
    "options": [
      "Reduce paid advertising costs",
      "Increase visibility and ranking of a website on search engines",
      "Improve the graphic design of the website",
      "Increase the number of social media followers"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "SEO’s primary goal is to increase the organic visibility of a website on search engines, improving its ranking to attract more traffic without paying for ads."
  },
  {
    "id": 578,
    "question": "What is the main purpose of a CTA button on a Landing Page?",
    "options": [
      "Show company statistics",
      "Present legal information",
      "Encourage visitors to take an action",
      "Increase the time visitors spend on the page"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A CTA (Call To Action) button is designed to encourage visitors to perform a specific action, such as signing up, purchasing, or requesting information."
  },
  {
    "id": 579,
    "question": "What does Gross Domestic Product (GDP) measure?",
    "options": [
      "The total monetary value of all goods and services produced within a country in a specific period",
      "The income distribution among the population",
      "The total exports of a country",
      "The inflation rate"
    ],
    "correctAnswer": 0,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "GDP measures the total market value of all final goods and services produced within a country's borders over a specific period, usually annually or quarterly."
  },
  {
    "id": 580,
    "question": "A company has a Current Ratio of 2.5. After a more detailed analysis, it is discovered that a large part of its current assets consist of obsolete inventory and accounts receivable from customers with financial difficulties. Considering this information, how might this affect the interpretation of the Current Ratio?",
    "options": [
      "The calculated Current Ratio would still be an accurate measure of the company's liquidity",
      "The Current Ratio could overestimate the company's ability to meet its short-term obligations",
      "The Current Ratio could underestimate the company's ability to meet its short-term obligations",
      "None of the above"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The Current Ratio can overestimate the company's real liquidity if it includes current assets that are not easily convertible to cash, such as obsolete inventory or doubtful accounts receivable."
  },
  {
    "id": 581,
    "question": "What is the main advantage of a well-prepared business plan?",
    "options": [
      "Reduce immediate operating costs",
      "Facilitate internal communication",
      "Attract investors",
      "Improve organizational culture"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A well-prepared business plan is key to attracting investors, as it demonstrates that the company has a clear strategy, defined objectives, and a plan to achieve them."
  },
  {
    "id": 582,
    "question": "The break-even point is useful for:",
    "options": [
      "Determining long-term financial profitability",
      "Calculating return on investment",
      "Determining how many units must be sold to cover all costs",
      "Measuring the company's annual growth"
    ],
    "correctAnswer": 2,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The break-even point indicates the minimum number of units that must be sold to cover all costs, without making losses or profits."
  },
  {
    "id": 583,
    "question": "Which of the following is an example of a company with social consequences?",
    "options": [
      "A factory dedicated exclusively to fast fashion",
      "A company that sells eco-friendly products to generate profits",
      "A business that operates solely as a financial intermediary",
      "A store that only sells imported products without certification"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "A factory dedicated to fast fashion usually has negative social impacts such as poor labor conditions and environmental effects, reflecting significant social consequences."
  },
  {
    "id": 584,
    "question": "Which of the following statements best describes an Operational Plan?",
    "options": [
      "Details the company’s annual budget",
      "Explains how the company would produce goods or services",
      "Defines the communication and marketing strategy",
      "Presents the SWOT analysis of the organization"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "The Operational Plan describes the activities, processes, and resources necessary to produce goods or services, ensuring that the company operates efficiently."
  },
  {
    "id": 585,
    "question": "Which two variables are usually considered when measuring risk?",
    "options": [
      "Time and money",
      "Probability and impact",
      "Profitability and liquidity",
      "Quality and quantity"
    ],
    "correctAnswer": 1,
    "subject": "economy",
    "topic": "Midterm",
    "explanation": "Risk is commonly measured by considering the probability that an event will occur and the impact that the event would have on the project or business."
  }



]


const subjects = 
{
  economy: "Economy",
  transmedia: "Transmedia",
}

const topics = 
{
  economy: 
  {
    "1.1": "Topic 1.1",
    "1.2": "Topic 1.2",
    "2.1": "Topic 2.1",
    "2.2": "Topic 2.2",
    "3.1": "Topic 3.1",
    "3.2": "Topic 3.2",
    "4.1": "Topic 4.1",
    "4.2": "Topic 4.2",
    "4.3": "Topic 4.3",
    "4.4": "Topic 4.4",
    "5.0": "Topic 5.0",
    Midterm: "Midterm 2024",
  },
  transmedia: 
  {
    "1.1": "Topic 1.1",
    "1.2": "Topic 1.2",
    "2.1": "Topic 2.1",
    "2.2": "Topic 2.2",
  },
}

// Utility functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const shuffleQuestionOptions = (question: Question): QuestionWithShuffled => {
  const optionsWithIndex = question.options.map((option, index) => ({ option, index }))
  const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex)

  const shuffledOptions = shuffledOptionsWithIndex.map((item) => item.option)
  const shuffledCorrectAnswer = shuffledOptionsWithIndex.findIndex((item) => item.index === question.correctAnswer)

  return {
    ...question,
    shuffledOptions,
    shuffledCorrectAnswer,
  }
}

const getStoredStats = (): Record<string, TopicStats> => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("quizStats")
  return stored ? JSON.parse(stored) : {}
}

const saveStats = (stats: Record<string, TopicStats>) => {
  if (typeof window === "undefined") return
  localStorage.setItem("quizStats", JSON.stringify(stats))
}

const getQuestionCountForTopic = (subject: string, topic: string): number => {
  if (topic === "all") {
    return mockQuestions.filter((q) => q.subject === subject).length
  }
  return mockQuestions.filter((q) => q.subject === subject && q.topic === topic).length
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-200"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function QuizApp() {
  const [activeTab, setActiveTab] = useState("quiz")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [showAnswerImmediately, setShowAnswerImmediately] = useState<boolean>(true)
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionWithShuffled[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [topicStats, setTopicStats] = useState<Record<string, TopicStats>>(getStoredStats())
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [questionSummary, setQuestionSummary] = useState<QuestionSummary[]>([])
  const [questionLimit, setQuestionLimit] = useState<number | "all">("all")

  const availableTopics = selectedSubject
    ? [...new Set(mockQuestions.filter((q) => q.subject === selectedSubject).map((q) => q.topic))]
    : []

  useEffect(() => {
    if (selectedSubject) {
      let questions = mockQuestions.filter((q) => q.subject === selectedSubject)
      if (selectedTopic && selectedTopic !== "all") {
        questions = questions.filter((q) => q.topic === selectedTopic)
      }

      // Shuffle questions and their options
      let shuffledQuestions = shuffleArray(questions).map(shuffleQuestionOptions)

      // Apply question limit if set
      const limit = Number(questionLimit)
      if (questionLimit !== "all" && !isNaN(limit) && limit > 0) 
      {
        shuffledQuestions = shuffledQuestions.slice(0, limit)
      }

      setFilteredQuestions(shuffledQuestions)
      setUserAnswers(new Array(shuffledQuestions.length).fill(null))
    }
  }, [selectedSubject, selectedTopic, questionLimit])

  const updateTopicStats = (topic: string, isCorrect: boolean) => {
    const currentStats = topicStats[topic] || {
      topic,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 0,
      score: 0,
      testAttempts: [],
    }

    const updatedStats = {
      ...currentStats,
      totalQuestions: currentStats.totalQuestions + 1,
      correctAnswers: isCorrect ? currentStats.correctAnswers + 1 : currentStats.correctAnswers,
      incorrectAnswers: isCorrect ? currentStats.incorrectAnswers : currentStats.incorrectAnswers + 1,
    }

    updatedStats.accuracy = (updatedStats.correctAnswers / updatedStats.totalQuestions) * 100
    updatedStats.score = (updatedStats.correctAnswers / updatedStats.totalQuestions) * 10

    const newTopicStats = { ...topicStats, [topic]: updatedStats }
    setTopicStats(newTopicStats)
    saveStats(newTopicStats)
  }

  const recordTestAttempt = (finalScore: number) => {
    if (selectedTopic && selectedTopic !== "all") {
      const currentStats = topicStats[selectedTopic] || {
        topic: selectedTopic,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        score: 0,
        testAttempts: [],
      }

      const updatedStats = {
        ...currentStats,
        testAttempts: [...currentStats.testAttempts, { score: finalScore, timestamp: Date.now() }].slice(-10),
      }

      const newTopicStats = { ...topicStats, [selectedTopic]: updatedStats }
      setTopicStats(newTopicStats)
      saveStats(newTopicStats)
    }
  }

  const generateQuestionSummary = () => {
    const summary: QuestionSummary[] = filteredQuestions.map((question, index) => {
      const userAnswerIndex = userAnswers[index]
      const isAnswered = userAnswerIndex !== null
      const isCorrect = isAnswered && userAnswerIndex === question.shuffledCorrectAnswer

      return {
        question: question.question,
        userAnswer: isAnswered ? question.shuffledOptions[userAnswerIndex] : null,
        correctAnswer: question.shuffledOptions[question.shuffledCorrectAnswer],
        isCorrect,
        isAnswered,
        topic: question.topic,
        explanation: question.explanation,
      }
    })

    setQuestionSummary(summary)
  }

  const startQuiz = () => {
    if (filteredQuestions.length > 0) {
      // Re-shuffle the questions and their options for each new quiz
      const reshuffledQuestions = shuffleArray([...filteredQuestions]).map((question) => {
        // Create a new shuffled version of each question
        const optionsWithIndex = question.options.map((option, index) => ({ option, index }))
        const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex)

        const shuffledOptions = shuffledOptionsWithIndex.map((item) => item.option)
        const shuffledCorrectAnswer = shuffledOptionsWithIndex.findIndex(
          (item) => item.index === question.correctAnswer,
        )

        return {
          ...question,
          shuffledOptions,
          shuffledCorrectAnswer,
        }
      })

      setFilteredQuestions(reshuffledQuestions)
      setQuizStarted(true)
      setCurrentQuestionIndex(0)
      setScore(0)
      setAnsweredQuestions(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setMissedQuestions([])
      setUserAnswers(new Array(reshuffledQuestions.length).fill(null))
      setQuestionSummary([])
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newUserAnswers)

    if (showAnswerImmediately) {
      const currentQuestion = filteredQuestions[currentQuestionIndex]
      const isCorrect = answerIndex === currentQuestion.shuffledCorrectAnswer

      // Only update stats if this is a new answer
      if (userAnswers[currentQuestionIndex] === null) {
        if (isCorrect) {
          setScore(score + 1)
        } else {
          // Add to missed questions
          const missedQuestion: MissedQuestion = {
            question: currentQuestion.question,
            yourAnswer: currentQuestion.shuffledOptions[answerIndex],
            correctAnswer: currentQuestion.shuffledOptions[currentQuestion.shuffledCorrectAnswer],
            explanation: currentQuestion.explanation,
            topic: currentQuestion.topic,
          }
          setMissedQuestions((prev) => [...prev, missedQuestion])
        }

        updateTopicStats(currentQuestion.topic, isCorrect)
        setAnsweredQuestions(answeredQuestions + 1)
      }

      setShowResult(true)
      // Remove auto-completion logic - let user manually navigate
    }
  }

  const handleNextQuestion = () => {
    // Save current answer
    if (selectedAnswer !== null) {
      const newUserAnswers = [...userAnswers]
      newUserAnswers[currentQuestionIndex] = selectedAnswer
      setUserAnswers(newUserAnswers)
    }

    // Only process scoring if this is a new question (not navigating back)
    const isNewQuestion =
      userAnswers[currentQuestionIndex] === null || userAnswers[currentQuestionIndex] !== selectedAnswer

    if (isNewQuestion) {
      if (!showAnswerImmediately && selectedAnswer === null) {
        // Skip question - mark as incorrect
        const currentQuestion = filteredQuestions[currentQuestionIndex]
        const missedQuestion: MissedQuestion = {
          question: currentQuestion.question,
          yourAnswer: "No answer selected",
          correctAnswer: currentQuestion.shuffledOptions[currentQuestion.shuffledCorrectAnswer],
          explanation: currentQuestion.explanation,
          topic: currentQuestion.topic,
        }
        setMissedQuestions((prev) => [...prev, missedQuestion])
        updateTopicStats(currentQuestion.topic, false)
        setAnsweredQuestions(answeredQuestions + 1)
      } else if (!showAnswerImmediately && selectedAnswer !== null) {
        // Check answer
        const currentQuestion = filteredQuestions[currentQuestionIndex]
        const isCorrect = selectedAnswer === currentQuestion.shuffledCorrectAnswer

        if (isCorrect) {
          setScore(score + 1)
        } else {
          const missedQuestion: MissedQuestion = {
            question: currentQuestion.question,
            yourAnswer: currentQuestion.shuffledOptions[selectedAnswer],
            correctAnswer: currentQuestion.shuffledOptions[currentQuestion.shuffledCorrectAnswer],
            explanation: currentQuestion.explanation,
            topic: currentQuestion.topic,
          }
          setMissedQuestions((prev) => [...prev, missedQuestion])
        }

        updateTopicStats(currentQuestion.topic, isCorrect)
        setAnsweredQuestions(answeredQuestions + 1)
      }
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || null)
      setShowResult(showAnswerImmediately && userAnswers[currentQuestionIndex + 1] !== null)
    }
    // Remove auto-completion logic here
  }

  const handleFinishQuiz = () => {
    // Process current question if not answered and not already shown result
    let finalScoreValue = score

    if (!showResult && selectedAnswer !== null && !showAnswerImmediately) {
      const currentQuestion = filteredQuestions[currentQuestionIndex]
      const isCorrect = selectedAnswer === currentQuestion.shuffledCorrectAnswer

      if (isCorrect) {
        finalScoreValue = score + 1
        setScore(finalScoreValue) // Only update score here when we actually process a new answer
      } else {
        const missedQuestion: MissedQuestion = {
          question: currentQuestion.question,
          yourAnswer: currentQuestion.shuffledOptions[selectedAnswer],
          correctAnswer: currentQuestion.shuffledOptions[currentQuestion.shuffledCorrectAnswer],
          explanation: currentQuestion.explanation,
          topic: currentQuestion.topic,
        }
        setMissedQuestions((prev) => [...prev, missedQuestion])
      }

      updateTopicStats(currentQuestion.topic, isCorrect)
      setAnsweredQuestions(answeredQuestions + 1)
    } else if (!showResult && selectedAnswer === null) {
      // Skip current question if no answer selected
      const currentQuestion = filteredQuestions[currentQuestionIndex]
      const missedQuestion: MissedQuestion = {
        question: currentQuestion.question,
        yourAnswer: "No answer selected",
        correctAnswer: currentQuestion.shuffledOptions[currentQuestion.shuffledCorrectAnswer],
        explanation: currentQuestion.explanation,
        topic: currentQuestion.topic,
      }
      setMissedQuestions((prev) => [...prev, missedQuestion])
      updateTopicStats(currentQuestion.topic, false)
      setAnsweredQuestions(answeredQuestions + 1)
    }

    // Generate question summary and force quiz completion
    generateQuestionSummary()
    setAnsweredQuestions(filteredQuestions.length)

    // Calculate final score based on finalScoreValue
    const calculatedFinalScore = filteredQuestions.length > 0 ? (finalScoreValue / filteredQuestions.length) * 10 : 0
    recordTestAttempt(calculatedFinalScore)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before moving
      if (selectedAnswer !== null) {
        const newUserAnswers = [...userAnswers]
        newUserAnswers[currentQuestionIndex] = selectedAnswer
        setUserAnswers(newUserAnswers)
      }

      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1])
      setShowResult(showAnswerImmediately && userAnswers[currentQuestionIndex - 1] !== null)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(0)
    setMissedQuestions([])
    setUserAnswers([])
    setQuestionSummary([])
  }

  const goToMainMenu = () => {
    setActiveTab("quiz")
    setQuizStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(0)
    setMissedQuestions([])
    setUserAnswers([])
    setQuestionSummary([])
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex]
  const isQuizComplete = answeredQuestions === filteredQuestions.length && filteredQuestions.length > 0
  const answeredCount = userAnswers.filter((answer) => answer !== null).length
  const progressPercentage = filteredQuestions.length > 0 ? (answeredCount / filteredQuestions.length) * 100 : 0
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1

  const renderAnalytics = () => {
    const statsArray = Object.values(topicStats).sort((a, b) => b.totalQuestions - a.totalQuestions)

    // Prepare data for global chart
    const globalChartData = [
      {
        name: "Correct",
        value: statsArray.reduce((sum, stat) => sum + stat.correctAnswers, 0),
        fill: "#10b981",
      },
      {
        name: "Incorrect",
        value: statsArray.reduce((sum, stat) => sum + stat.incorrectAnswers, 0),
        fill: "#ef4444",
      },
    ]

    // Prepare data for topics bar chart (using score 0-10)
    const topicsBarData = statsArray.map((stat) => ({
      topic: `Topic ${stat.topic}`,
      score: Number.parseFloat(stat.score.toFixed(1)),
      correct: stat.correctAnswers,
      incorrect: stat.incorrectAnswers,
      total: stat.totalQuestions,
    }))

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-2 sm:p-4 transition-all duration-500">
        <ThemeToggle />
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center mb-8">
            <div className="relative">
              <BarChart3 className="mx-auto h-20 w-20 text-emerald-600 dark:text-emerald-400 mb-4 drop-shadow-lg" />
              <Sparkles className="absolute -top-2 -right-2 h-0 w-6 text-yellow-500 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
              Analytics 
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300"></p>
          </div>

          <div className="mb-8">
            <Button
              onClick={goToMainMenu}
              variant="outline"
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Home className="h-4 w-4" />
              Back to Main Menu
            </Button>
          </div>

          {statsArray.length === 0 ? (
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <TrendingUp className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
                <p className="text-gray-500 dark:text-gray-400 text-xl mb-6">
                  No quiz data yet. Start practicing to see your analytics!
                </p>
                <Button
                  onClick={() => setActiveTab("quiz")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
                {/* Mike Acton Photo at the Bottom */}
<div className="flex flex-col items-center mt-12 mb-8">
  <img
    src="/acton1_0.jpg"
    alt="Mike Acton"
    className="rounded shadow-lg w-80 h-80 object-cover"
  />
  
  <p className="mt-4 text-center text-gray-600 italic">
    Mike Acton wouldn't be proud of the implementation of this page
  </p>
</div>
              </CardContent>
            </Card>
            
          ) : (
            <div className="flex flex-col gap-8">
              {/* Global Overview */}
              <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10">
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Trophy className="h-0 w-8 text-emerald-600 dark:text-emerald-400" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-lg">
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {statsArray.reduce((sum, stat) => sum + stat.totalQuestions, 0)}
                        </p>
                        <p className="text-blue-800 dark:text-blue-300 font-medium">Total Questions</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl shadow-lg">
                        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                          {statsArray.reduce((sum, stat) => sum + stat.correctAnswers, 0)}
                        </p>
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium">Correct Answers</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-lg">
                        <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {(
                            (statsArray.reduce((sum, stat) => sum + stat.correctAnswers, 0) /
                              statsArray.reduce((sum, stat) => sum + stat.totalQuestions, 0)) *
                            10
                          ).toFixed(1)}
                        </p>
                        <p className="text-purple-800 dark:text-purple-300 font-medium">Overall Score</p>
                      </div>
                    </div>

                    {/* Global Pie Chart */}
                    <div className="flex justify-center">
                      <ChartContainer
                        config={{
                          correct: { label: "Correct", color: "#10b981" },
                          incorrect: { label: "Incorrect", color: "#ef4444" },
                        }}
                        className="h-[250px] w-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={globalChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={100}
                              dataKey="value"
                            >
                              {globalChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Topics Overview Bar Chart */}
              <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10">
                  <CardTitle className="text-3xl">Score by Topic (0-10)</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-8">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[350px] sm:min-w-0 h-[250px] sm:h-[350px]">
                      <ChartContainer
                        config={{
                          score: { label: "Score", color: "#3b82f6" },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={topicsBarData}>
                            <XAxis dataKey="topic" />
                            <YAxis domain={[0, 10]} />
                            <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            <ChartTooltip content={<ChartTooltipContent />} formatter={(value, name) => [value, "Score"]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
{/* Mike Acton Photo at the Bottom */}
<div className="flex flex-col items-center mt-12 mb-8">
  <img
    src="/acton1_0.jpg"
    alt="Mike Acton"
    className="rounded shadow-lg w-80 h-80 object-cover"
  />
  
  <p className="mt-4 text-center text-gray-600 italic">
    Mike Acton wouldn't be proud of the implementation of this page
  </p>
</div>
              
        </div>
      )}
    </div>
  </div>
)
  }

  if (activeTab === "analytics") {
    return renderAnalytics()
  }

  if (!quizStarted) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4 transition-all duration-500">
          <ThemeToggle />
          <div className="mx-auto max-w-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0">
                <TabsTrigger
                  value="quiz"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quiz">
                <div className="text-center mb-8">
                  <div className="relative">
                    <BookOpen className="mx-auto h-0 w-20 text-indigo-600 dark:text-indigo-400 mb-4 drop-shadow-lg" />
                    <Sparkles className="absolute -top-2 -right-2 h-0 w-6 text-yellow-500 animate-pulse" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                    
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    
                  </p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10">
                    <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                      <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      Midnight Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50 border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                          {Object.entries(subjects).map(([key, value]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedSubject && (
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Topic</label>
                        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                          <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50 border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                            <SelectItem value="all" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                              <div className="flex justify-between items-center w-full">
                                <span>All topics</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                  ({getQuestionCountForTopic(selectedSubject, "all")} questions)
                                </span>
                              </div>
                            </SelectItem>
                            {Object.entries(topics[selectedSubject as keyof typeof topics]).map(
                              ([topicKey, topicName]) => (
                                <SelectItem
                                  key={topicKey}
                                  value={topicKey}
                                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span>{topicName}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                      ({getQuestionCountForTopic(selectedSubject, topicKey)} questions)
                                    </span>
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        
                      </div>
                      
                    )}

                    {selectedSubject && (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Set the maximum number of questions
    </label>
    <input
      type="number"
      value={questionLimit}
      onChange={(e) => {
        const rawValue = e.target.value;

        // Allow empty string so user can delete all characters
        if (rawValue === '') {
          setQuestionLimit('');
          return;
        }

        const value = Number(rawValue);
        if (!isNaN(value)) {
          setQuestionLimit(value);
        }
      }}
      className="h-12 w-full rounded-lg border-2 bg-white/50 dark:bg-gray-700/50 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
      min="1"
      max={filteredQuestions.length}
      disabled={filteredQuestions.length === 0}
    />
    {filteredQuestions.length > 0 ? (
      <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
        Enter the number of questions you want to practice (maximum: {filteredQuestions.length}).
        
      </p>
    ) : (
      <p className="text-xs text-red-500 dark:text-red-400">
        No questions available for this subject.
      </p>
    )}
  </div>
)}

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                        <Checkbox
                          id="show-answer"
                          checked={showAnswerImmediately}
                          onCheckedChange={(checked) => setShowAnswerImmediately(checked as boolean)}
                          className="border-2"
                        />
                        <label
                          htmlFor="show-answer"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                        >
                          Show answer immediately after selection
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
                        {showAnswerImmediately
                          ? "Answers will be shown immediately when you select an option"
                          : "Review missed questions at the end of the test"}
                      </p>
                    </div>

                    {filteredQuestions.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                          <strong>{filteredQuestions.length}</strong> questions available for practice (randomized)
                        </p>
                      </div>
                    )}
                    

                    <Button
                      onClick={startQuiz}
                      disabled={filteredQuestions.length === 0}
                      className="w-full h-14 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-12 text-center">
              <a
                href="https://docs.google.com/document/d/1I9rDIekOVPR_JyWGnMYYecI3d_-b1IOX-co_IN12ToE/edit?pli=1&tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-100 transition"
              >
                View the study document
              </a>
            </div>
        </div>
        
      </ThemeProvider>
      
    )
  }

  if (isQuizComplete) {
    const finalScore = (score / filteredQuestions.length) * 10

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 p-4 transition-all duration-500">
        
        <ThemeToggle />
        <div className="mx-auto max-w-6xl">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10">
              <div className="mx-auto mb-6">
                {finalScore >= 7.0 ? (
                  <div className="relative">
                    <CheckCircle className="h-20 w-20 text-emerald-500 dark:text-emerald-400 drop-shadow-lg" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
                  </div>
                ) : (
                  <XCircle className="h-20 w-20 text-red-500 dark:text-red-400 drop-shadow-lg" />
                )}
              </div>
              <CardTitle className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-8 p-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                  <p className="text-7xl font-bold text-gray-900 dark:text-gray-100 mb-3">{finalScore.toFixed(1)}</p>
                  <p className="text-3xl text-gray-600 dark:text-gray-300 mb-6">
                    {score}/{filteredQuestions.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Badge variant="outline" className="text-sm px-4 py-2 bg-white/50 dark:bg-gray-700/50">
                  {subjects[selectedSubject as keyof typeof subjects]}
                </Badge>
                {selectedTopic && selectedTopic !== "all" && (
                  <Badge variant="outline" className="text-sm ml-2 px-4 py-2 bg-white/50 dark:bg-gray-700/50">
                    {
                      topics[selectedSubject as keyof typeof topics][
                        selectedTopic as keyof (typeof topics)[keyof typeof topics]
                      ]
                    }
                  </Badge>
                )}
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={goToMainMenu}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 dark:bg-gray-700/80 hover:scale-105 transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  Main Menu
                </Button>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 dark:bg-gray-700/80 hover:scale-105 transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Quiz
                </Button>
                <Button
                  onClick={startQuiz}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:scale-105 transition-all duration-200"
                >
                  Retry Quiz
                </Button>
                <Button
                  onClick={() => setActiveTab("analytics")}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 dark:bg-gray-700/80 hover:scale-105 transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* All Questions and Answers */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                All Questions and Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {questionSummary.map((question, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 ${
                      question.isCorrect
                        ? "border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
                        : question.isAnswered
                          ? "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {question.isCorrect ? (
                          <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        ) : question.isAnswered ? (
                          <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                        ) : (
                          <Minus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="bg-white/50 dark:bg-gray-700/50">
                            Question {index + 1}
                          </Badge>
                          <Badge variant="outline" className="bg-white/50 dark:bg-gray-700/50">
                            Topic {question.topic}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">
                          {question.question}
                        </h4>
                        <div className="grid gap-3 text-sm">
                          {question.isAnswered && (
                            <div
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                question.isCorrect
                                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                                  : "bg-red-100 dark:bg-red-900/30"
                              }`}
                            >
                              <span
                                className={`font-semibold ${
                                  question.isCorrect
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                Your answer:
                              </span>
                              <span
                                className={
                                  question.isCorrect
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-red-700 dark:text-red-300"
                                }
                              >
                                {question.userAnswer}
                              </span>
                            </div>
                          )}
                          {!question.isCorrect && (
                            <div className="flex items-center gap-3 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                Correct answer:
                              </span>
                              <span className="text-emerald-700 dark:text-emerald-300">{question.correctAnswer}</span>
                            </div>
                          )}
                          {question.explanation && !question.isCorrect && (
                            <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <span className="font-semibold text-blue-900 dark:text-blue-300">Explanation: </span>
                              <span className="text-blue-800 dark:text-blue-200">{question.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missed Questions Review */}
          {missedQuestions.length > 0 && (
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-400/10 dark:to-pink-400/10">
                <CardTitle className="text-3xl text-red-600 dark:text-red-400 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8" />
                  Questions You Missed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {missedQuestions.map((missed, index) => (
                    <div
                      key={index}
                      className="border-2 border-red-200 dark:border-red-800 rounded-xl p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"
                    >
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-3 bg-white/50 dark:bg-gray-700/50">
                          Topic {missed.topic}
                        </Badge>
                        <h4 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{missed.question}</h4>
                      </div>
                      <div className="grid gap-3 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <span className="font-semibold text-red-600 dark:text-red-400">Your answer:</span>
                          <span className="text-red-700 dark:text-red-300">{missed.yourAnswer}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Correct answer:</span>
                          <span className="text-emerald-700 dark:text-emerald-300">{missed.correctAnswer}</span>
                        </div>
                        {missed.explanation && (
                          <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <span className="font-semibold text-blue-900 dark:text-blue-300">Explanation: </span>
                            <span className="text-blue-800 dark:text-blue-200">{missed.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-4 transition-all duration-500">
      <ThemeToggle />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2 bg-white/50 dark:bg-gray-700/50">
                {subjects[selectedSubject as keyof typeof subjects]}
              </Badge>
              {selectedTopic && selectedTopic !== "all" && (
                <Badge variant="outline" className="px-4 py-2 bg-white/50 dark:bg-gray-700/50">
                  {
                    topics[selectedSubject as keyof typeof topics][
                      selectedTopic as keyof (typeof topics)[keyof typeof topics]
                    ]
                  }
                </Badge>
              )}
            </div>
            <Button
              onClick={goToMainMenu}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-gray-700/80 hover:scale-105 transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Menu
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 font-medium">
              <span>
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </span>
              <span>
                Score: {score}/{answeredCount}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/50 dark:bg-gray-700/50" />
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10">
            <CardTitle className="text-2xl leading-relaxed text-gray-900 dark:text-gray-100">
              {currentQuestion?.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid gap-4">
              {currentQuestion?.shuffledOptions.map((option, index) => {
                let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline"
                let buttonClass = "transition-all duration-200 hover:scale-[1.02]"

                if (showResult) {
                  if (index === currentQuestion.shuffledCorrectAnswer) {
                    buttonVariant = "default"
                    buttonClass =
                      "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-emerald-500 shadow-lg"
                  } else if (index === selectedAnswer) {
                    buttonVariant = "destructive"
                    buttonClass =
                      "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
                  }
                } else if (selectedAnswer === index) {
                  buttonVariant = "secondary"
                  buttonClass =
                    "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-300 dark:border-purple-600 shadow-md"
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={`h-auto p-6 text-left justify-start whitespace-normal ${buttonClass} bg-white/50 dark:bg-gray-700/50 border-2`}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <span className="font-bold mr-4 text-lg">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-base">{option}</span>
                  </Button>
                )
              })}
            </div>

            {showResult && currentQuestion?.explanation && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">Explanation:</h4>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            

            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="bg-white/80 dark:bg-gray-700/80 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </Button>

              <div className="flex gap-3">
                {!isLastQuestion ? (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Next Question
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Finish Quiz
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Finish Quiz?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          Are you sure you want to finish the quiz? You have answered {answeredCount} out of{" "}
                          {filteredQuestions.length} questions.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:scale-105 transition-all duration-200">
                          Continue Quiz
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleFinishQuiz}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105 transition-all duration-200"
                        >
                          Finish Quiz
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
