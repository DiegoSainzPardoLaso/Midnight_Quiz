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
    "explanation": "Entrepreneurs drive innovation and job creation, which are key components of economic growth."
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
    formulas: "Formulas",
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-all duration-500">
        <ThemeToggle />
        <div className="mx-auto max-w-6xl">
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
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
                <CardContent className="p-8">
                  <ChartContainer
                    config={{
                      score: { label: "Score", color: "#3b82f6" },
                    }}
                    className="h-[350px] w-full"
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
                </CardContent>
              </Card>

              {/* Individual Topic Trend Charts */}
              <div className="grid gap-8 md:grid-cols-2">
                {statsArray
                  .filter((stat) => stat.testAttempts && stat.testAttempts.length > 0)
                  .map((stat) => {
                    const trendData = stat.testAttempts.map((attempt, index) => ({
                      test: `Test ${index + 1}`,
                      score: Number.parseFloat(attempt.score.toFixed(1)),
                    }))

                    // Add a second point for single test to show a line
                    if (trendData.length === 1) {
                      trendData.push({
                        test: "Test 2",
                        score: trendData[0].score,
                      })
                    }

                    return (
                      <Card key={stat.topic} className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        
                        
                      </Card>
                    )
                  })}
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
                      Setup Quiz
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
      <p className="text-xs text-gray-500 dark:text-gray-400">
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
