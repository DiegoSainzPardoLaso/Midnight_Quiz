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
    "correctAnswer": 1,
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
  },
  {
  "id": 586,
  "question": "The phases of the operating cycle to be considered when calculating the average economic maturity period are:",
  "options": [
    "Storage of raw materials, manufacturing, storage of finished products, collection from customers.",
    "Storage of raw materials, manufacturing, storage of finished products, storage of returned products, collection from customers",
    "Storage of raw materials, manufacturing, storage of semi-finished products, storage of finished products, collection from customers",
    "None is correct"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The average economic maturity period includes the phases of the operating cycle from the acquisition of raw materials to the collection of sold finished products, excluding returned or semi-finished products."
},
{
  "id": 587,
  "question": "The average economic maturity period:",
  "options": [
    "Allows us to see the average time it takes to recover a monetary unit invested in the operating cycle.",
    "Allows us to see if the need for the company's assets can be reduced",
    "Allows us to see if the need for immobilized capital can be reduced",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The average economic maturity period provides insights into the duration and efficiency of the operating cycle. It helps assess the recovery time of invested capital, as well as opportunities to optimize asset and capital usage."
},
{
  "id": 588,
  "question": "A possible classification of types of investments can be:",
  "options": [
    "Tangible and intangible",
    "Fixed asset and current asset",
    "Financial and productive",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Investments can be classified in various ways: by their nature (tangible or intangible), by their role in the balance sheet (fixed or current assets), or by their purpose (financial or productive)."
},
{
  "id": 589,
  "question": "Cash flows:",
  "options": [
    "Are one of the fundamental variables that determine an investment analysis",
    "Are the same as the profit generated in the same period",
    "Include only the income generated in the same period",
    "All are correct"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Cash flows are crucial in investment analysis because they reflect the actual movement of money in and out of a business. Unlike accounting profit, they consider all cash transactions and are not limited to income or affected by non-cash items."
},
{
  "id": 590,
  "question": "The internal rate of return (IRR):",
  "options": [
    "Does not take the time factor into account",
    "Is one of the dynamic methods of investment selection",
    "Examines the annual return required by the investor",
    "All are correct"
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The IRR is a dynamic investment appraisal method that *does* take the time value of money into account. It calculates the discount rate that makes the net present value (NPV) of cash flows equal to zero. Therefore, option a is incorrect, and option b is correct."
},
{
  "id": 591,
  "question": "NPV (Net Present Value) (VAN in spanish) is one of the dynamic methods of investment selection, therefore:",
  "options": [
    "It estimates the difference between the present value of the investment project and its initial outlay",
    "It considers that capital has different value depending on the moment it is generated",
    "It seeks to measure whether the investment project increases or decreases the value of the firm",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "NPV is a dynamic investment evaluation method that incorporates the time value of money. It calculates whether an investment will add value to the firm by comparing the present value of future cash flows to the initial investment."
},
{
  "id": 592,
  "question": "Sources of financing:",
  "options": [
    "Are different ways of obtaining the necessary means to carry out investments",
    "Some of the criteria used for their classification are duration and ownership",
    "Can be internal or external",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Financing sources refer to the various methods through which a business obtains funds for its operations or investments. They are classified based on factors such as time horizon (short or long-term), origin (internal or external), and ownership (equity or debt)."
},
{
  "id": 593,
  "question": "Inflation:",
  "options": [
    "Makes it difficult to calculate the cost of a source of financing",
    "Does not affect the cost of a source of financing",
    "Favors debtors and harms creditors",
    "All are correct"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Inflation generally benefits debtors because they repay loans with money that has less purchasing power, and it harms creditors for the same reason. However, it does not make the cost calculation easier and does affect financing costs, so only option c is correct."
},
{
  "id": 594,
  "question": "The 'valley of death', in entrepreneurial terms, refers to:",
  "options": [
    "The period of time between when a startup receives initial capital and when it begins to generate revenue.",
    "The positive cash flow in the early stages of a startup.",
    "A point from which it is impossible to exit a startup, so the business is usually shut down.",
    "None of the above."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The 'valley of death' refers to the critical early phase of a startup when the business is operating at a loss and has yet to generate steady income. It is a challenging period where many startups fail if they cannot secure further funding or reach profitability."
},
{
  "id": 595,
  "question": "A restaurant offering a free dessert with a main course on a specific day of the week is using an effective strategy to boost sales. This also creates the perception in consumers' minds that they are getting great value for their money. What pricing tactic is being used in this case?",
  "options": [
    "Odd pricing",
    "Bundle pricing",
    "Captive product pricing",
    "Dynamic pricing"
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Bundle pricing involves offering multiple products or services together for a single price, often perceived as a bargain by customers. In this case, the dessert is bundled with the main dish to enhance perceived value and encourage purchases."
},
{
  "id": 596,
  "question": "Franchising:",
  "options": [
    "Offers the franchisor an opportunity to enter new markets with minimal initial funding.",
    "Is a good formula for business expansion when the franchisor has limited capital.",
    "Is a good way to grow when the franchisor has limited human resources.",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Franchising allows a business to expand rapidly without requiring large amounts of capital or personnel. Franchisees provide the investment and management, enabling the franchisor to scale up efficiently in new markets."
},
{
  "id": 597,
  "question": "New product development:",
  "options": [
    "Is an external growth strategy for a company.",
    "Is an internal growth strategy for a company.",
    "Is a strategy for any company when the global economy slows down.",
    "None of the above"
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Developing new products is considered an internal growth strategy because it involves using a company's own resources and capabilities to innovate and expand its product offerings."
},
{
  "id": 598,
  "question": "Strict employment protection:",
  "options": [
    "Is generally more favorable to the creation of new businesses.",
    "Is more detrimental to the creation of new businesses in factor-driven and efficiency-driven countries.",
    "Is strongly associated with low entrepreneurial initiative in the early stages.",
    "None of the above"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Strict employment protection is often linked to reduced entrepreneurial activity in early stages, as it increases the perceived risk and cost of hiring, which can discourage new business creation, especially in environments with limited flexibility."
},
{
  "id": 599,
  "question": "Cash flow is generated by the following types of activities:",
  "options": [
    "Ongoing business operations, also known as operating activities.",
    "Purchase of fixed assets, acquisition or sale of other businesses, and other investing activities.",
    "Borrowing and repayment of loans, issuance or repurchase of shares, and other financing activities.",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Cash flow arises from three main types of activities: operating (day-to-day operations), investing (e.g., purchase or sale of assets), and financing (e.g., issuing shares or repaying loans)."
},
{
  "id": 600,
  "question": "The business location, as one of the points in a business plan, should:",
  "options": [
    "Be analyzed based on advantages for the business, such as legal and administrative facilities, good access infrastructure, digital connectivity, or proximity to essential services and raw materials, among others.",
    "Be decided by the investors who will fund the business's growth.",
    "Be decided exclusively based on employment and education levels.",
    "All are correct"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The location of a business must be strategically chosen based on factors that benefit operations, such as infrastructure, accessibility, legal advantages, and proximity to resources. While investors and labor conditions are important, they are not the sole deciding factors."
},
{
  "id": 601,
  "question": "The downside of being an entrepreneur:",
  "options": [
    "Refers to income uncertainty",
    "Can involve a low quality of life",
    "May include a high level of stress",
    "All are correct"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Entrepreneurship often comes with income instability, long working hours, stress, and challenges that can affect quality of life, especially in the early stages of the business."
},
{
  "id": 602,
  "question": "A liquidity crisis is caused by:",
  "options": [
    "Excessive supplies and a rapid increase in business expenses",
    "Overdue accounts receivable",
    "A high volume of fixed asset acquisitions, such as machinery and equipment",
    "All are correct"
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "A liquidity crisis can arise from multiple factors, including rising expenses, delayed payments from customers, and large capital expenditures that reduce available cash."
},
{
  "id": 603,
  "question": "Business opportunities:",
  "options": [
    "Do not depend on the availability of funds to turn them into a viable business",
    "Are attractive, timely, and lasting business ideas",
    "Are characterized by being attractive, lasting, and timely, and must be anchored in a product or service",
    "All are correct"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "A true business opportunity must be attractive, timely, and durable, and it must be based on a real product or service that addresses a need or problem. Funding is important, but the opportunity itself must have intrinsic potential."
},
{
  "id": 604,
  "question": "The main characteristics of market windows are the following:",
  "options": [
    "They should immediately generate returns on investment",
    "They fit products and services that are completely new, establishing a clear competitive advantage in the market",
    "They remain open for a relatively long time, allowing new products or services to be introduced and accepted in the market",
    "All are correct"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Market windows are periods during which new products or services can enter and gain acceptance. They may not yield immediate returns, but their duration allows for market penetration and establishing competitive advantage."
},
{
  "id": 605,
  "question": "What are the reasons for writing a business plan?",
  "options": [
    "To communicate the merits of the company to people outside of it, such as investors or bankers",
    "To force shareholders and managers to think systematically about every aspect of the business",
    "To establish short- and long-term strategies and explain how to pursue all set objectives",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Writing a business plan helps communicate the business's value to external stakeholders, encourages thorough planning by internal teams, and sets clear strategies and goals for the company."
},
{
  "id": 606,
  "question": "A start-up:",
  "options": [
    "Exists to learn how to build a sustainable business",
    "Focuses on how to turn ideas into products, measure consumer response, and know when to pivot or persevere",
    "Must be in an iterative process involving repetition focused on learning and improving the business model",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Start-ups are experimental ventures aimed at discovering scalable and sustainable business models through iterative learning and adaptation."
},
{
  "id": 607,
  "question": "A company with limited liability means:",
  "options": [
    "The company's debt liability generally does not fall on the owners personally",
    "The company's debt liability generally falls on the owners personally",
    "Owners must bear a high personal income tax impulse that replaces the corporate income tax by paying in unlimited liability companies",
    "None of the above"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Limited liability means that owners' personal assets are protected, and they are not personally responsible for the company's debts beyond their investment."
},
{
  "id": 608,
  "question": "External factors influencing business activities include:",
  "options": [
    "Technological development and innovation",
    "Political, cultural, and economic forces",
    "Demographic development",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Business activities are influenced by a wide range of external factors including technology, politics, culture, economy, and demographics."
},
{
  "id": 609,
  "question": "For a company to be functional, it needs to:",
  "options": [
    "Produce regardless of whether the goods and services produced generate utility",
    "Have the set of production factors (land, labor, and capital) coordinated by the entrepreneur",
    "Pursue the main objectives which are exactly the same in any company",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "A functional company must coordinate the essential factors of production through effective management to operate efficiently."
},
{
  "id": 610,
  "question": "When a company has a negative gross margin:",
  "options": [
    "The alert level is maximum, since the more the company sells, the more losses it generates",
    "It means that some costs cannot be covered by revenues",
    "It requires an extraordinary review as the alert level is lower in this case",
    "It is impossible to cover financial costs generated by a high level of company leverage"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "A negative gross margin signals serious financial trouble, indicating that increased sales lead to greater losses, requiring urgent attention."
},
{
  "id": 611,
  "question": "Demand:",
  "options": [
    "Includes customers and stakeholders who can affect market trends",
    "Represents the quantity of products or services that the target market wants and can buy to satisfy their needs",
    "Includes data related to price, distribution, or packaging of the product and how the customer values these aspects",
    "Belongs to the microenvironment that influences the company's ability to conduct business transactions"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Demand specifically refers to the amount of goods or services that customers in the target market are willing and able to purchase."
},
{
  "id": 612,
  "question": "Companies are classified:",
  "options": [
    "Only by their size considering exclusively the number of employees: small, medium, and large",
    "Only according to ownership form (individual and collective) and the purposes pursued (commercial and civil)",
    "According to various criteria, including the sector, such as primary, secondary, or tertiary",
    "All are correct"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Companies can be classified based on multiple factors, including size, ownership type, and sector of activity."
},
{
  "id": 613,
  "question": "The subsystems of a company:",
  "options": [
    "Include administration, financing, production, and commercial, among others",
    "Are aligned with the processes through which orders and information flow",
    "Position administration in the management process with the purpose of planning, organizing, and controlling the activities needed to achieve set objectives",
    "All are correct"
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Company subsystems encompass key functions and processes, including management, finance, production, and sales, all essential for achieving business goals."
},
{
  "id": 614,
  "question": "Indicate which pricing strategy applies in the following example: \"The software has a higher price than the system itself, and it is necessary to update it periodically as new versions are introduced to the market\":",
  "options": [
    "Odd pricing",
    "Bundle pricing",
    "Captive product pricing",
    "Dynamic pricing"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Captive product pricing involves charging a higher price for a product that must be used with a primary product, often requiring periodic updates or purchases."
},
{
  "id": 615,
  "question": "The retail price of a ski jacket is €85.00, allowing the retailer to obtain a profit margin of 45%. What is the cost of the jacket?",
  "options": [
    "€46.75",
    "€154.55",
    "€188.89",
    "None of the above"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "To find the cost, divide the retail price by 1 plus the profit margin: 85 / (1 + 0.45) = €58.62. Since none matches, the correct answer is 'None of the above.' However, the closest given option is €46.75 if considering margin differently."
},
{
  "id": 616,
  "question": "Leasing (Arrendamiento)...:",
  "options": [
    "Is a way to obtain more capital.",
    "Means that the company is the user but not the owner of an asset.",
    "Consists of selling an asset to obtain a more balanced cash flow, but the interest rates to be paid in this case are very high.",
    "Are the revenues generated by the sale of goods or services before deducting any costs or expenses."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Leasing means the company uses an asset without owning it, typically paying periodic fees for its use."
},
{
  "id": 617,
  "question": "Creativity, as one of the critical elements of entrepreneurial initiative:",
  "options": [
    "Is high in environments where working conditions are not very good.",
    "Is high in environments where motivation is high.",
    "Is high in environments where there are many obstacles, especially emotional ones.",
    "All are correct."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Creativity tends to be higher in environments where motivation is high, fostering initiative and innovation."
},
{
  "id": 618,
  "question": "The start-up method:",
  "options": [
    "Is based on a scientific approach.",
    "Involves building the proposal, measuring assumptions, modifying them according to feedback, and learning from the process and results.",
    "Involves learning more quickly what works and discarding what does not work.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The start-up method uses a scientific, iterative approach that focuses on quickly learning what works through feedback and adaptation."
},
{
  "id": 619,
  "question": "Indicate what DOES NOT refer to Business Angels:",
  "options": [
    "They are wealthy individuals who invest in start-ups in exchange for equity in the company.",
    "Their contribution is a donation and not an investment.",
    "It is an example of capital as a source of financing for a startup.",
    "They usually finance growth in the early years of a startup."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Business Angels invest capital in start-ups in exchange for equity; their contribution is an investment, not a donation."
},
{
  "id": 620,
  "question": "The difference between a company's total revenues and its expenses is:",
  "options": [
    "Measures the company's liquidity.",
    "Is a profit.",
    "Indicates the financial growth of a company.",
    "All are correct."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The difference between total revenues and expenses is called profit. It does not directly measure liquidity or indicate financial growth."
},
{
  "id": 621,
  "question": "Fundraising for a startup:",
  "options": [
    "Is an exit strategy for future investors.",
    "Is raising funds for current financial needs and those not yet identified.",
    "Focuses on covering previously identified specific financing needs.",
    "All are correct."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Fundraising in startups involves securing capital not only for immediate known needs but also to anticipate future financial requirements that might arise."
},
{
  "id": 622,
  "question": "Equity (Patrimonio):",
  "options": [
    "Implies shared control of a company.",
    "Includes the personal capital of the company's founders.",
    "Is more attractive than debt since there is no scheduled repayment.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Equity represents ownership interest which often means shared control, includes founders' personal capital, and unlike debt, does not require fixed repayments, making it attractive in financing."
},
{
  "id": 623,
  "question": "Indicate what is NOT related to an executive summary in a business plan:",
  "options": [
    "It is a brief summary by sections.",
    "It includes an outline of the business strategy.",
    "It includes a detailed financial plan and requirements.",
    "It shows the vision and mission of a company."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The executive summary is a brief and clear summary covering the main sections, strategy, vision, and mission, but it usually does not include a detailed financial plan, which is presented in specific sections of the plan."
},
{
  "id": 624,
  "question": "Which document shows when money is available to pay investors?",
  "options": [
    "The pro forma income statement.",
    "The pro forma cash flow statement.",
    "A pro forma balance sheet.",
    "A current account statement."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The pro forma cash flow statement shows cash inflows and outflows, indicating when money is available to pay investors."
},
{
  "id": 625,
  "question": "If a startup defines its market too broadly, it means that:",
  "options": [
    "It lacks a clear vision of a true target market.",
    "It will have more chances to get a lot of capital from investors.",
    "The local government will help because it will create more jobs in the region.",
    "None of the above."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Defining the market too broadly indicates a lack of focus and an unclear vision of the true target market, which can hinder the startup's success."
},
{
  "id": 626,
  "question": "Crowdfunding:",
  "options": [
    "Is a popular way for small startups to obtain initial funding.",
    "Uses the power of the Internet and social media to raise funds.",
    "Involves donations rather than investments from ordinary people.",
    "All of the above."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Crowdfunding is a popular method of initial funding for small businesses and startups, leveraging the Internet and social media to raise money. It can involve donations, investments, or rewards, so all the options are correct together."
},
{
  "id": 627,
  "question": "In entrepreneurial language, a 'valley of death' is:",
  "options": [
    "A financial gap between the invention (idea) and the commercialization of the product/service (business launch).",
    "Associated with negative cash flow in the early stages of a startup.",
    "The period during which new startups experience negative cash flow.",
    "All of the above."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The 'valley of death' refers to the time when startups face negative cash flow between developing an idea and launching a product, making all statements correct."
},
{
  "id": 628,
  "question": "Creative approach for entrepreneurs:",
  "options": [
    "Helps reduce risks and uncertainty in decision-making.",
    "Is related to a new way of thinking and offers new results in the form of ideas or products.",
    "Is usually more effective in a creative environment.",
    "All of the above."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "A creative approach helps entrepreneurs by reducing risks and uncertainty, encourages innovative thinking, and is most effective in creative environments, making all options correct."
},
{
  "id": 629,
  "question": "Indicate the focus of possible business opportunities that correspond to the legal and regulatory:",
  "options": [
    "Insurance, telecommunications, pension funds, and energy management.",
    "New capital structure.",
    "Technological innovation.",
    "Service quality."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Legal and regulatory business opportunities typically involve sectors such as insurance, telecommunications, pension funds, and energy management, where compliance and regulation play a major role."
},
{
  "id": 630,
  "question": "The main objectives of the Lean Startup method are:",
  "options": [
    "Include recognizing opportunities that serve its social mission and engaging in an innovative economic process.",
    "Achieve a complete and concise business model, validate ideas, and react accordingly.",
    "Offer a market window open for a long time.",
    "All are correct."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The Lean Startup method focuses on developing a clear business model, validating ideas quickly, and adapting based on feedback to reduce risk and increase success chances."
},
{
  "id": 631,
  "question": "In a general partnership (sociedad colectiva), when liability is limited:",
  "options": [
    "The partnership has a single general partner who manages the business and is responsible for its obligations.",
    "Partners pay special taxes in addition to personal income tax.",
    "Each partner is personally responsible not only for their own actions but also for the actions of all partners.",
    "All are correct."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "In a general partnership with limited liability, there is usually a single managing partner responsible for the obligations. The other options describe unlimited liability or tax aspects not specific to this case."
},
{
  "id": 632,
  "question": "Cash flow is generated by the following types of activities:",
  "options": [
    "Operating activities.",
    "Purchase, sale, or investment in fixed assets.",
    "Financing activities.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Cash flow is generated from operating, investing (purchase/sale of fixed assets), and financing activities, so all options are correct."
},
{
  "id": 633,
  "question": "The proliferation of fast food restaurants is not due to people's liking for fast food, but because people are busy and often don't have time to cook their own meals. Identify the driving force behind this new business opportunity for fast food restaurants:",
  "options": [
    "Economic.",
    "Social.",
    "Regulatory and political.",
    "None of the above."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The key driver behind the growth of fast food restaurants is social factors, particularly people's busy lifestyles and lack of time to cook."
},
{
  "id": 634,
  "question": "A printer manufacturer sells color ink cartridges for the printer. To maintain printer performance, it is advisable that the customer uses ink from the same manufacturer, although cartridges from other suppliers, usually of lower quality, are also available. Therefore, in this case, the customer does not have many options but to buy ink from the main manufacturer. Thus, the manufacturer can afford to set ink prices at higher levels since its customer base is almost guaranteed. What pricing tactic is used in this case?",
  "options": [
    "Price skimming.",
    "Bundle pricing.",
    "Captive product pricing.",
    "Dynamic pricing."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Captive product pricing involves setting a low price for the main product but higher prices for necessary complementary products, such as ink cartridges for printers."
},
{
  "id": 635,
  "question": "When presenting a business proposal, the entrepreneur's goal is to achieve the highest possible score in the so-called 5 C's. What are they?",
  "options": [
    "Capital, capacity, collateral, character, and conditions.",
    "Cost, capital, cash flow, customers, and control.",
    "Creativity, commitment, capital, customers, and communication.",
    "Capital, confidence, collaboration, character, and control."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The 5 C's refer to Capital, Capacity, Collateral, Character, and Conditions, which are criteria used to evaluate the creditworthiness of a business proposal."
},
{
  "id": 636,
  "question": "What are the main sections of a business plan?",
  "options": [
    "Executive summary, complete business plan, and operational plan.",
    "Marketing plan, financial plan, and human resources plan.",
    "Product description, sales strategy, and customer analysis.",
    "Risk analysis, contingency plan, and growth strategy."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The main sections of a business plan typically include an executive summary, the complete detailed business plan, and the operational plan."
},
{
  "id": 637,
  "question": "What types of social entrepreneurship do you know?",
  "options": [
    "Traditional, social consequence, social purpose, and non-profit entrepreneurship.",
    "Commercial, technological, environmental, and educational entrepreneurship.",
    "Corporate, individual, cooperative, and community entrepreneurship.",
    "Innovative, sustainable, collaborative, and impact entrepreneurship."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The main types of social entrepreneurship include traditional, social consequence, social purpose, and non-profit entrepreneurship."
},
{
  "id": 638,
  "question": "What kind of obstacles do norms and rules present for an entrepreneur?",
  "options": [
    "Rational evaluation obstacles.",
    "Financial obstacles.",
    "Emotional obstacles.",
    "Legal obstacles."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "Norms and rules often present rational evaluation obstacles for entrepreneurs, as they must carefully assess compliance and regulatory requirements."
},
{
  "id": 639,
  "question": "Problems faced by a company can be solved by reassigning elements without needing to act directly on them. According to K. Ohmae's three-approach mental model, what type of solution is used in this case?",
  "options": [
    "Mechanical",
    "Organic",
    "Cultural",
    "Strategic"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "In K. Ohmae's model, a mechanical solution involves solving problems by rearranging existing elements without changing their nature."
},
{
  "id": 640,
  "question": "Which concepts are related to the entrepreneur?",
  "options": [
    "New business, innovation, risk-taking",
    "Marketing, sales, accounting",
    "Production, logistics, distribution",
    "Finance, investment, dividends"
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 1",
  "explanation": "The key concepts related to an entrepreneur include starting a new business, innovating, and taking risks."
},
{
  "id": 641,
  "question": "Startups influenced by families...",
  "options": [
    "Are a new type of business where the family sets the strategy for decision-making and the financial structure of the new company.",
    "Are startups founded by an existing family business that can create synergies with the main company.",
    "Are acquisitions of a startup by the existing family business.",
    "None of the above."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Startups influenced by families are typically those founded by an existing family business and can generate synergies with the parent company."
},
{
  "id": 642,
  "question": "Indicate which pricing strategy applies in the following example: 'The price of the computer software is higher compared to the operating system price and it needs to be updated regularly when new versions are released.'",
  "options": [
    "Odd Pricing",
    "Bundling Pricing",
    "Captive-product Pricing",
    "Dynamic Pricing"
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "This is an example of captive-product pricing, where the main product is sold at a lower price, but complementary products or updates (software) are sold at a higher price to generate ongoing revenue."
},
{
  "id": 643,
  "question": "Social entrepreneurship...",
  "options": [
    "Can be combined with philanthropy and specific government programs.",
    "Is associated with innovation applied to deficiencies detected in society, such as education, poverty, health, or environmental issues.",
    "Is generally formulated through the hybrid model that combines social purpose businesses and nonprofit organizations focused on social missions.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Social entrepreneurship involves innovative solutions to social problems and often combines business with philanthropy and nonprofit approaches."
},
{
  "id": 644,
  "question": "What are the ways to increase a company's profitability? Indicate the one that fits best:",
  "options": [
    "Increase billing by setting higher unit selling prices and trying to sell more products than before.",
    "Use multiple sources of financing.",
    "Increase operating costs.",
    "All are correct."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Increasing profitability is best achieved by raising unit prices and increasing sales volume, while increasing costs does not improve profitability."
},
{
  "id": 645,
  "question": "Innovation...",
  "options": [
    "Is related to the entrepreneur.",
    "Refers to the implementation of new creative ideas in the form of new products, procedures, systems, and solutions to problems.",
    "Involves new combinations that the entrepreneur makes in an economic environment.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Innovation involves creative implementation of new ideas and combinations in an economic context, and is closely linked to the entrepreneur."
},
{
  "id": 646,
  "question": "Factoring...",
  "options": [
    "Is a long-term financing mechanism.",
    "Means the company is the user but not the owner of the asset.",
    "Involves selling an asset to achieve a more balanced cash flow, with quite high interest payments.",
    "Involves a loan secured by an asset."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Factoring involves selling accounts receivable to improve cash flow, often with higher costs, rather than being a long-term financing method or a secured loan."
},
{
  "id": 647,
  "question": "The franchise model offers multiple advantages because...",
  "options": [
    "It makes it possible to reach new markets with less risk of capital and human resources.",
    "It is fully focused on social entrepreneurship, thus contributing to solving many social and environmental problems.",
    "It creates a powerful network, but only for franchises operating through direct sales channels.",
    "All are correct."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "The franchise model allows expansion into new markets with reduced capital and human resource risks, which is one of its key advantages."
},
{
  "id": 648,
  "question": "Liquidity...",
  "options": [
    "Is the company's strategy to generate profit.",
    "Is the company's ability to meet its short-term obligations.",
    "Refers to intangible assets such as know-how, brand, or R&D.",
    "All are correct."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Liquidity refers to a company's ability to cover its short-term liabilities, ensuring it can meet financial obligations as they come due."
},
{
  "id": 649,
  "question": "The downside of being an entrepreneur...",
  "options": [
    "Refers to the uncertainty of income.",
    "Can lead to a low quality of life.",
    "May include a high level of stress.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Being an entrepreneur often involves uncertain income, potential impacts on quality of life, and high stress levels."
},
{
  "id": 650,
  "question": "Business opportunities...",
  "options": [
    "Do not depend on the availability of funds to transform them into a viable business.",
    "Are attractive, timely, and lasting business ideas.",
    "Are characterized by being attractive, lasting, and timely, and must be anchored in a product or service.",
    "All are correct."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Business opportunities are defined as attractive, timely, and lasting ideas that are based on a product or service; they generally depend on available funds to become viable."
},
{
  "id": 651,
  "question": "The main characteristics of market windows are:",
  "options": [
    "They should generate immediate returns on investment.",
    "They fit those products and services that are absolutely new, establishing a clear competitive advantage in the market.",
    "They remain open for a relatively long time, allowing new products or services to be introduced and accepted in the market.",
    "All are correct."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Market windows are characterized by being open for a relatively long time, giving new products or services the opportunity to enter and be accepted by the market."
},
{
  "id": 652,
  "question": "What are the reasons for writing a business plan?",
  "options": [
    "To communicate the merits of the company to people who are not part of it, such as investors or bankers.",
    "To force shareholders and managers to think systematically about every aspect of the business.",
    "To establish short- and long-term strategies and explain how to pursue all the set objectives.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "A business plan helps communicate the company's merits, requires key stakeholders to consider all aspects of the business, and establishes strategies to achieve short- and long-term objectives."
},
{
  "id": 653,
  "question": "Capital...",
  "options": [
    "Includes different sources of financing, such as personal savings, crowdfunding donations, or venture capital.",
    "Includes bank loans and lines of credit that offer a more economical financing cost.",
    "Is a method of raising financing from multiple sources.",
    "None of the above."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Capital encompasses various financing sources, including personal savings, crowdfunding, venture capital, bank loans, and credit lines, providing multiple avenues for funding a business or investment."
},
{
  "id": 654,
  "question": "A start-up...",
  "options": [
    "Exists to learn how to build a sustainable business.",
    "Focuses on turning ideas into products, measuring consumer response, and deciding whether to pivot or persevere.",
    "Must be in an iterative process that involves repetition, focusing on learning and improving the business model.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "A start-up is a dynamic organization designed to learn and adapt, focusing on transforming ideas into products, analyzing customer feedback, and iterating to refine its business model."
},
{
  "id": 655,
  "question": "Indicate what does NOT correspond to creativity:",
  "options": [
    "Its level is high in environments where motivation is high.",
    "The presence of many obstacles positively influences employees' creativity.",
    "It is one of the critical elements in entrepreneurship.",
    "It can be learned, but it is important to foster it through appropriate environments."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Creativity thrives in motivated environments and can be cultivated, but excessive obstacles may hinder rather than enhance creative thinking."
},
{
  "id": 656,
  "question": "Indicate what does NOT refer to crowdfunding:",
  "options": [
    "It is always recommended in the mature stage of the business.",
    "It is considered capital to create or continue the business.",
    "It includes various modalities, such as donations or loans.",
    "It is an effective method of rapid capital growth simultaneously through multiple investors."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Crowdfunding is commonly used in early-stage business development rather than in mature stages, as it helps generate initial funding from a broad network of supporters."
},
{
  "id": 657,
  "question": "The development of a new product:",
  "options": [
    "Is an external growth strategy for a company.",
    "Is an internal growth strategy for a company.",
    "Is a strategy for any company when the global economy stagnates.",
    "None of the above."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "Developing a new product is considered an internal growth strategy, as it focuses on innovation within the company to expand its market presence and competitiveness."
},
{
  "id": 658,
  "question": "The external forces that influence business activity:",
  "options": [
    "Refer only to potential competitors.",
    "Refer to suppliers, consumers, and existing competitors.",
    "Are demographic, natural, economic, political, cultural, and technological.",
    "None of the above."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "External forces influencing businesses include demographic, economic, political, and technological factors, along with suppliers, consumers, and competitors, shaping the competitive landscape."
},
{
  "id": 659,
  "question": "The lean startup method...",
  "options": [
    "Uses 'macro' market information, requires an initial hypothesis, and validates the idea.",
    "Helps build a sustainable business.",
    "Uses adaptation as a method, allowing quick reactions to any detected market changes.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "The lean startup method is based on iterative learning, market validation, and adaptability, helping businesses efficiently evolve in response to market changes."
},
{
  "id": 660,
  "question": "A liquidity crisis is caused by...",
  "options": [
    "Excessive supplies and a rapid increase in business expenses.",
    "Overdue accounts receivable.",
    "A high volume of fixed asset acquisitions, such as machinery and equipment.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 2",
  "explanation": "A liquidity crisis occurs due to financial mismanagement, including excessive spending, delayed receivables, and major investments in fixed assets without ensuring sufficient cash flow."
},
{
  "id": 661,
  "question": "A liquidity crisis is caused by...",
  "options": [
    "Excessive supplies and a rapid increase in business expenses.",
    "Overdue accounts receivable.",
    "A high volume of fixed asset acquisitions, such as machinery and equipment.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "A liquidity crisis occurs due to financial mismanagement, including excessive spending, delayed receivables, and major investments in fixed assets without ensuring sufficient cash flow."
},
{
  "id": 662,
  "question": "Business opportunities...",
  "options": [
    "Do not depend on the availability of funds to become a viable company.",
    "Have a common characteristic: the quality of being attractive, durable, and timely, and must be anchored in a product or service.",
    "Are attractive, timely, and durable business ideas.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Business opportunities must be viable, strategic, and anchored in a product or service that meets market demands effectively and sustainably."
},
{
  "id": 663,
  "question": "The 'valley of death', in business terms, refers to:",
  "options": [
    "The period between when a startup receives its initial capital injection and when it begins generating revenue.",
    "The association with positive cash flow in the early stages of a startup.",
    "The idea that it is impossible for a startup to recover, so such businesses are often closed.",
    "None of the above."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "The 'valley of death' describes the challenging period a startup faces between obtaining its initial funding and starting to generate revenue, making cash flow management a critical hurdle for survival."
},
{
  "id": 664,
  "question": "Capital...",
  "options": [
    "Includes different sources of financing, such as personal savings, crowdfunding donations, or venture capital.",
    "Includes bank loans and lines of credit that offer a more economical financing cost.",
    "Is a method of obtaining capital from multiple sources.",
    "None of the above."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Capital is acquired through various financing sources—personal savings, crowdfunding donations, venture capital, bank loans, and credit lines—which means it is essentially obtained from multiple channels."
},
{
  "id": 665,
  "question": "Family-influenced startups...",
  "options": [
    "It is an acquisition of a newly created company by an existing family business.",
    "It is a startup founded by an already existing family business, which could create synergies with the main business.",
    "It is a new business in which the family established the decision-making strategy and the financial structure of this new enterprise.",
    "None of the above."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Family-influenced startups typically refer to new ventures founded by an existing family business, thereby leveraging the core business's experience and creating possible synergies."
},
{
  "id": 666,
  "question": "Cash flow is generated by the following types of activities:",
  "options": [
    "Regular ongoing business activities, also known as operating activities.",
    "Acquisition of fixed assets, acquisition or sale of other businesses, and other investment activities.",
    "Borrowing and repayment of loans, issuance or repurchase of shares, and other financing activities.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Cash flow is generated from operating, investing, and financing activities, meaning all these activities contribute to the overall cash flow of a business."
},
{
  "id": 667,
  "question": "Indicate what does NOT correspond to leasing:",
  "options": [
    "Leasing preserves capital and offers more flexibility than loans for purchasing equipment.",
    "In leasing, the company is a user rather than the owner of an asset.",
    "Leasing can address a company's working capital needs.",
    "Leasing an item is almost always more expensive than purchasing it."
  ],
  "correctAnswer": 2,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Leasing is commonly used to preserve capital and finance fixed assets rather than to manage working capital needs. While leasing may incur higher long-term costs, it is not intended to serve as a solution for a company's circulating capital requirements."
},
{
  "id": 668,
  "question": "Overly optimistic financial projections presented by a startup...",
  "options": [
    "Will lose credibility with investors.",
    "Mean that the entrepreneur is very committed to the company.",
    "Convey that the business plan is based on solid evidence.",
    "All are correct."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Overly optimistic financial projections often lead to losing credibility with investors when the results do not match these high expectations. They do not inherently indicate strong commitment from the entrepreneur nor demonstrate that the business plan is based on solid evidence."
},
{
  "id": 669,
  "question": "Indicate what characterizes social entrepreneurship:",
  "options": [
    "It can have different organizational models, such as non-profit, for-profit, or even hybrid social enterprises.",
    "It is always associated with innovation, whether in the form of new products and services or in new production and distribution methods.",
    "It includes a new business approach aimed at alleviating problems associated with poverty.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Social entrepreneurship is characterized by its versatility in organizational models, its strong focus on innovation, and its commitment to addressing social challenges like poverty, making all of these aspects fundamental to the concept."
},
{
  "id": 670,
  "question": "Indicate what does NOT refer to crowdfunding:",
  "options": [
    "It is considered capital to start or continue a business.",
    "It is always recommended during the mature stage of the company.",
    "It includes various modalities such as donations or loans.",
    "It is an effective and fast-growing method to obtain capital simultaneously through many private investors."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Crowdfunding is primarily used to raise capital in the early stages of a business rather than during its mature phase. It leverages various financing modalities from a broad pool of private investors, making option B the one that does not apply."
},
{
  "id": 671,
  "question": "Innovation...",
  "options": [
    "It is related to the entrepreneur.",
    "It refers to the application of new creative ideas in the form of new products, procedures, systems, and problem-solving solutions.",
    "It implies new combinations that an entrepreneur forms in an economic environment.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Innovation is characterized by its connection to entrepreneurship, the application of creative ideas into new products and processes, and the formation of novel combinations within the economic environment. Therefore, all of the statements are correct."
},
{
  "id": 672,
  "question": "Liquidity...",
  "options": [
    "Refers to assets that can be easily converted into cash.",
    "Is the ability of a company to meet its long-term financial obligations.",
    "Is a profit that goes to the company's owners.",
    "All are correct."
  ],
  "correctAnswer": 0,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Liquidity is defined by the ease with which assets can be quickly converted into cash without a significant loss in value. Option (a) correctly captures this concept, while options (b) and (c) refer to other financial aspects not directly related to liquidity."
},
{
  "id": 673,
  "question": "What are the reasons for writing a business plan?",
  "options": [
    "To communicate the merits of a company to outsiders, such as investors or bank managers.",
    "To force shareholders and executives to systematically reflect on every aspect of the company.",
    "To establish long- and short-term strategies and describe how to pursue all the related objectives.",
    "All are correct."
  ],
  "correctAnswer": 3,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "A business plan serves multiple roles: it communicates the company's strengths to external stakeholders, compels key decision-makers to evaluate every aspect of the enterprise, and outlines both short- and long-term strategies to achieve the company's goals. Therefore, all the statements are correct."
},
{
  "id": 674,
  "question": "The franchise offers multiple advantages because...",
  "options": [
    "It is entirely focused on social entrepreneurship, thereby contributing to solving many social and environmental problems.",
    "It enables reaching new markets with less capital risk and fewer human resources.",
    "It creates a powerful network, but only for franchised companies that operate through direct sales.",
    "All are correct."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "Among the provided options, option (b) is the most accurate. Franchising primarily offers the advantage of market expansion with lower capital risk and reduced human resource commitments. The other options contain attributes that are either too narrow or not generally applicable to the franchising model."
},
{
  "id": 675,
  "question": "In a company with unlimited liability...",
  "options": [
    "The private assets of investors and owners are not at risk if the company fails.",
    "The shareholders are responsible for paying the company's financial obligations.",
    "The shareholders are not liable for the company's debt with their personal assets.",
    "None of the above."
  ],
  "correctAnswer": 1,
  "subject": "economy",
  "topic": "Final 3",
  "explanation": "In a company with unlimited liability, shareholders are fully accountable for the company's financial obligations, meaning their personal assets can be used to cover business debts. Options (a) and (c) incorrectly suggest protection from personal liability, while option (b) correctly describes the inherent risk of unlimited liability."
},
{
    "id": 676,
    "question": "¿Qué implica el paso de monomedia a multimedia en los medios digitales?",
    "options": [
      "La especialización en un único tipo de lenguaje comunicativo.",
      "La incorporación de múltiples lenguajes como texto, audio y vídeo en un mismo medio.",
      "El uso exclusivo de medios impresos frente a los digitales.",
      "La eliminación de contenido visual en favor del texto."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La transición de monomedia a multimedia implica que los medios digitales combinan distintos lenguajes (texto, imagen, vídeo, sonido), borrando la separación tradicional entre medios."
  },
  {
    "id": 677,
    "question": "¿Cuál es una consecuencia directa de la transición de la periodicidad al tiempo real en los medios?",
    "options": [
      "Mayor calidad en el análisis de noticias.",
      "Desaparición de las redes sociales como canales informativos.",
      "Saturación de información y pérdida de reflexión.",
      "Menor participación del usuario en la producción de contenido."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El paso de la periodicidad al tiempo real ha provocado una sobrecarga informativa y una disminución en la reflexión crítica, debido a la velocidad de producción y consumo de contenido."
  },
  {
    "id": 678,
    "question": "¿Qué caracteriza la transformación de la escasez a la abundancia en el entorno digital?",
    "options": [
      "La limitación en la cantidad de contenido accesible para los usuarios.",
      "La dificultad para que los usuarios produzcan contenido.",
      "La sobreabundancia de información que requiere nuevos filtros de relevancia.",
      "La desaparición del rol del usuario como receptor."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El entorno digital ha generado una abundancia de información, haciendo necesarios nuevos criterios de selección, organización y recomendación de contenidos."
  },
  {
    "id": 679,
    "question": "¿Qué implica la transformación de lo analógico a lo digital en los medios?",
    "options": [
      "La pérdida de calidad en los contenidos audiovisuales.",
      "La preservación del medio físico como principal soporte de información.",
      "La transformación de los contenidos en datos codificables que se pueden transmitir y almacenar digitalmente.",
      "La eliminación de los archivos digitales por falta de espacio."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "Lo digital permite codificar y almacenar contenidos como datos binarios, posibilitando su transmisión, edición y preservación más eficiente frente a lo analógico."
  },
  {
    "id": 680,
    "question": "¿Cómo cambia el rol del usuario en el paso de la escasez a la abundancia?",
    "options": [
      "De consumidor pasivo a productor y curador de contenido.",
      "De periodista profesional a espectador.",
      "De receptor de medios impresos a televidente.",
      "De comunicador activo a lector ocasional."
    ],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "Con la abundancia de contenido, el usuario deja de ser sólo consumidor y asume roles como productor, editor, comentarista y recomendador."
  },
  {
    "id": 681,
    "question": "¿Qué implica la transición del broadcast al multicast en la comunicación digital?",
    "options": [
      "Una emisión masiva sin posibilidad de segmentación.",
      "La posibilidad de adaptar mensajes a públicos específicos.",
      "La eliminación de los medios de comunicación tradicionales.",
      "El uso exclusivo de plataformas audiovisuales."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El paso de broadcast (uno a todos) a multicast (uno a muchos seleccionados) permite que los contenidos sean dirigidos a públicos específicos, según intereses o características comunes."
  },
  {
    "id": 682,
    "question": "¿Qué transformación permite que los usuarios ya no dependan de un soporte físico para acceder a los contenidos?",
    "options": [
      "De lo digital a lo analógico.",
      "De la abundancia a la escasez.",
      "Del soporte al flujo.",
      "De la narrativa a la hiperficción."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El paso del soporte al flujo hace referencia a cómo los contenidos ya no requieren un medio físico (como un periódico o un disco) sino que circulan digitalmente a través de redes."
  },
  {
    "id": 683,
    "question": "¿Qué ocurre con el papel del emisor tradicional en el entorno transmedia?",
    "options": [
      "Se mantiene como único generador de mensajes.",
      "Desaparece completamente.",
      "Se transforma en un nodo más dentro de una red de múltiples emisores.",
      "Se convierte exclusivamente en moderador de debates."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "En el entorno transmedia, el emisor tradicional deja de ser único y se integra en una red de emisores y receptores que pueden intercambiar constantemente roles."
  },
  {
    "id": 684,
    "question": "¿Qué relación tiene la convergencia tecnológica con la transformación de los medios?",
    "options": [
      "Favorece la especialización de plataformas según tipo de contenido.",
      "Elimina la necesidad de dispositivos digitales.",
      "Permite que múltiples funciones se integren en un solo dispositivo.",
      "Fomenta el uso exclusivo de un lenguaje audiovisual."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La convergencia tecnológica permite que un solo dispositivo (como un smartphone) combine múltiples funciones: comunicación, producción, distribución y consumo de contenido."
  },
  {
    "id": 685,
    "question": "¿Cuál es una de las consecuencias principales del paso del consumo a la participación?",
    "options": [
      "Mayor control editorial de los medios tradicionales.",
      "Reducción del contenido disponible en línea.",
      "Empoderamiento del usuario como generador de contenido.",
      "Desaparición de las redes sociales."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La transformación del usuario pasivo a uno activo implica que ahora participa creando, comentando y difundiendo contenidos, generando un ecosistema de comunicación más horizontal."
  },
  {
    "id": 686,
    "question": "¿Cuál es un rasgo distintivo del medio digital frente al medio impreso?",
    "options": [
      "Su carácter efímero e irreproducible.",
      "La linealidad y secuencialidad obligatoria.",
      "La posibilidad de edición, actualización y replicación instantánea.",
      "La imposibilidad de archivar contenido."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "Los medios digitales permiten actualizar, replicar y compartir contenidos en tiempo real, lo cual representa una diferencia esencial respecto al medio impreso tradicional."
  },
  {
    "id": 687,
    "question": "¿Qué ha provocado el paso de la escasez de medios a su abundancia?",
    "options": [
      "La necesidad de control gubernamental sobre internet.",
      "La fragmentación de audiencias y la personalización del contenido.",
      "El regreso a los formatos impresos.",
      "La desaparición del rol del periodista."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La abundancia de medios ha dado lugar a audiencias más fragmentadas, donde el contenido se personaliza y se consume según intereses individuales y contextos específicos."
  },
  {
    "id": 688,
    "question": "¿Qué caracteriza la lógica de red frente a la lógica de masa?",
    "options": [
      "Comunicación vertical y jerárquica.",
      "Participación unidireccional del usuario.",
      "Comunicación distribuida y horizontal.",
      "Emisión restringida al entorno local."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La lógica de red se basa en relaciones horizontales, interacción entre usuarios y descentralización, en contraste con la lógica de masa tradicionalmente vertical y centralizada."
  },
  {
    "id": 689,
    "question": "¿Qué tipo de contenido predomina en el nuevo ecosistema digital?",
    "options": [
      "Contenido controlado exclusivamente por medios tradicionales.",
      "Contenido generado por usuarios (UGC).",
      "Contenido exclusivamente textual.",
      "Contenido exclusivamente corporativo."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El contenido generado por usuarios (UGC) ha cobrado gran protagonismo en el ecosistema digital, permitiendo a cualquier persona contribuir al flujo informativo."
  },
  {
    "id": 690,
    "question": "¿Qué efecto tiene la hipertextualidad en el consumo de contenidos digitales?",
    "options": [
      "Fomenta una lectura lineal.",
      "Limita la posibilidad de explorar otros contenidos.",
      "Permite navegar no linealmente a través de enlaces.",
      "Obliga al lector a seguir un único camino de lectura."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La hipertextualidad permite que el usuario navegue por distintos contenidos de forma no lineal, estableciendo sus propios recorridos informativos a través de enlaces."
  },
  {
    "id": 691,
    "question": "¿Cuál de los siguientes es un ejemplo de la evolución del texto al hipertexto?",
    "options": [
      "Un libro impreso con ilustraciones.",
      "Una noticia digital con enlaces a otras fuentes y multimedia.",
      "Una enciclopedia impresa.",
      "Un periódico físico de edición semanal."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El hipertexto integra enlaces, multimedia y navegación no lineal, como se ve en las noticias digitales que permiten profundizar con un solo clic."
  },
  {
    "id": 692,
    "question": "¿Cuál es una característica clave del entorno digital según Orihuela?",
    "options": [
      "La comunicación unilateral del emisor al receptor.",
      "La linealidad del mensaje.",
      "La interacción constante entre usuarios.",
      "La permanencia del soporte físico."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La interacción entre usuarios es un componente central del entorno digital, facilitando el diálogo, la colaboración y la creación compartida de contenido."
  },
  {
    "id": 693,
    "question": "¿Qué tipo de medio se construye en la era de la abundancia de información?",
    "options": [
      "Medios cerrados y jerárquicos.",
      "Medios interactivos, descentralizados y participativos.",
      "Medios exclusivamente académicos.",
      "Medios unidireccionales como la radio AM."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La abundancia de información ha impulsado la creación de medios abiertos, participativos e interactivos, donde los usuarios pueden intervenir activamente."
  },
  {
    "id": 694,
    "question": "¿Cómo afecta la digitalización al modelo de negocio de los medios tradicionales?",
    "options": [
      "Fortalece la venta de ejemplares impresos.",
      "Mantiene intacta la lógica publicitaria anterior.",
      "Obliga a replantear fuentes de ingresos y formas de distribución.",
      "Hace innecesaria la presencia en redes sociales."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La digitalización ha desafiado el modelo tradicional, forzando a los medios a encontrar nuevas formas de monetización, como el contenido premium, suscripciones y publicidad segmentada."
  },
  {
    "id": 695,
    "question": "¿Qué transformación permite la participación directa del usuario en la producción informativa?",
    "options": [
      "De emisor a espectador.",
      "De lector a editor colaborativo.",
      "De receptor a audiencia pasiva.",
      "De autor a consumidor."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La posibilidad de comentar, compartir, producir y editar información ha transformado al usuario en un actor activo, incluso en el rol de editor colaborativo."
  },
  {
    "id": 696,
    "question": "¿Qué cambio representa el paso de la escasez a la abundancia informativa?",
    "options": [
      "Un control centralizado del contenido.",
      "Una necesidad creciente de alfabetización mediática.",
      "Una simplificación del mensaje informativo.",
      "La eliminación de la necesidad de filtrar contenidos."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "En un entorno con sobrecarga de información, es esencial desarrollar habilidades de alfabetización mediática para discriminar fuentes y evaluar la calidad del contenido."
  },
  {
    "id": 697,
    "question": "¿Qué tipo de comunicación representa la lógica digital de red?",
    "options": [
      "Jerárquica y descendente.",
      "Circular y descentralizada.",
      "Unidireccional y cerrada.",
      "Secuencial y lineal."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La lógica digital de red permite una comunicación circular, interactiva y descentralizada, rompiendo con el modelo vertical de los medios tradicionales."
  },
  {
    "id": 698,
    "question": "¿Qué implica la transformación del receptor en usuario?",
    "options": [
      "Pasividad absoluta ante el mensaje.",
      "Capacidad de elegir, producir y redistribuir contenidos.",
      "Desaparición de la figura del autor.",
      "Incapacidad de interactuar con el contenido."
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El usuario digital deja de ser un mero receptor para asumir roles activos: elige, comenta, produce y comparte contenidos dentro de redes colaborativas."
  },
  {
    "id": 699,
    "question": "¿Cuál de los siguientes elementos no forma parte de la lógica transmedia?",
    "options": [
      "Fragmentación de la narrativa en múltiples plataformas.",
      "Participación del usuario en la expansión del contenido.",
      "Distribución secuencial de contenido en medios tradicionales.",
      "Complementariedad entre distintos formatos narrativos."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La transmedia no implica una simple distribución secuencial en medios tradicionales, sino una narrativa expandida en múltiples plataformas con participación activa del usuario."
  },
  {
    "id": 700,
    "question": "¿Qué fenómeno permite a los usuarios modificar, comentar y redistribuir los contenidos?",
    "options": [
      "Hegemonía informativa.",
      "Monopolio mediático.",
      "Interactividad digital.",
      "Consumo pasivo."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La interactividad digital permite a los usuarios no solo recibir contenido, sino también intervenir en él, comentarlo, modificarlo y redistribuirlo."
  },
  {
    "id": 701,
    "question": "¿Qué consecuencia tiene la disolución de la frontera entre productores y consumidores de contenido?",
    "options": [
      "La reducción del contenido en plataformas digitales.",
      "La profesionalización exclusiva del periodismo.",
      "La aparición del 'prosumidor', que produce y consume contenido.",
      "El regreso al modelo de comunicación unidireccional."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La disolución de fronteras entre productor y consumidor da origen al 'prosumidor', una figura central en el ecosistema digital, que participa activamente en la creación y distribución de contenido."
  },
  {
    "id": 702,
    "question": "¿Cuál es una característica del nuevo entorno mediático propiciado por la digitalización?",
    "options": [
      "Un único canal de distribución por contenido.",
      "Inmutabilidad del contenido una vez publicado.",
      "Multiplicidad de formatos, plataformas y narrativas.",
      "Dependencia exclusiva del soporte impreso."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La digitalización permite que el mismo contenido se adapte y distribuya en múltiples formatos y plataformas, ampliando las posibilidades narrativas y de alcance."
  },
  {
    "id": 703,
    "question": "¿Qué fenómeno describe la interacción constante de los usuarios en tiempo real?",
    "options": [
      "Consumo asincrónico de medios.",
      "Comunicación diferida.",
      "Conectividad permanente e instantaneidad.",
      "Lectura tradicional de contenidos impresos."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "La conectividad permanente e instantaneidad caracterizan la era digital, permitiendo que los usuarios interactúen con contenidos y entre ellos en tiempo real."
  },
  {
    "id": 704,
    "question": "¿Cuál es un desafío principal para los medios tradicionales en la era digital?",
    "options": [
      "La falta de herramientas digitales.",
      "La disminución del acceso a internet.",
      "La pérdida del control exclusivo sobre la producción informativa.",
      "La ausencia de periodistas profesionales."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "Los medios tradicionales ya no tienen el monopolio de la producción informativa, lo que obliga a adaptarse a nuevas dinámicas en las que el usuario también es productor de contenidos."
  },
  {
    "id": 705,
    "question": "¿Qué implica el paso del mensaje cerrado al mensaje abierto en medios digitales?",
    "options": [
      "Reducción de la interactividad.",
      "Mayor control sobre la interpretación del contenido.",
      "Posibilidad de que el contenido sea remezclado, comentado o ampliado.",
      "Imposibilidad de edición posterior al envío del mensaje."
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "1.0",
    "explanation": "El mensaje abierto permite la intervención del usuario, que puede comentar, modificar, compartir o incluso reutilizar el contenido en nuevos contextos digitales."
  },
  {
    "id": 706,
    "question": "¿Cuál fue una de las primeras novelas que incorporó imágenes fotográficas con un propósito estético?",
    "options": [
      "Fugues, de Marie-Françoise Plissart",
      "Bruges-la-Morte, de Georges Rodenbach",
      "Droit de regards, de Marie-Françoise Plissart",
      "Elige tu propia aventura"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Bruges-la-Morte (1892) de Georges Rodenbach es considerada la primera novela en incorporar imágenes fotográficas con un claro propósito estético."
  },
  {
    "id": 707,
    "question": "¿Qué caracteriza a una novela visual según Molina (2022)?",
    "options": [
      "Son relatos teatrales grabados en directo",
      "Se basan en textos con imágenes animadas sin sonido",
      "Funcionan como libros animados con diálogos interactivos",
      "Permiten crear música interactiva con elementos narrativos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Molina (2022) define la novela visual como una ficción digital interactiva cuya dinámica consiste en leer diálogos, funcionando como un libro animado."
  },
  {
    "id": 708,
    "question": "¿Qué permite la herramienta Twine?",
    "options": [
      "Grabar podcasts desde el móvil",
      "Diseñar videojuegos con motor gráfico 3D",
      "Crear historias interactivas sin necesidad de saber programar",
      "Ilustrar álbumes infantiles con IA"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Twine es una herramienta gratuita que permite crear historias interactivas con múltiples caminos sin necesidad de conocimientos de programación."
  },
  {
    "id": 709,
    "question": "¿Qué es el LARP dentro del contexto de los juegos de rol?",
    "options": [
      "Una herramienta de podcast educativo",
      "Un formato de cómic digital",
      "Un juego de rol de mesa con dados virtuales",
      "Un juego de rol en vivo donde los participantes interpretan físicamente"
    ],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "LARP (Live Action Role Playing) es una modalidad de juego de rol en vivo donde los jugadores interpretan físicamente a sus personajes."
  },
  {
    "id": 710,
    "question": "¿Qué término describe a un usuario que deja de ser solo consumidor para convertirse en creador de contenido?",
    "options": [
      "Streamer",
      "Influencer",
      "Prosumidor",
      "Creator-user"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El término 'Prosumidor', acuñado por Alvin Toffler en 'La tercera ola' (1980), se refiere a un usuario que es tanto consumidor como productor de contenido."
  },
  {
    "id": 711,
    "question": "¿Qué innovación tecnológica permitió popularizar la ilustración en libros durante los siglos XVIII y XIX?",
    "options": [
      "El internet",
      "La revolución industrial",
      "La fotografía digital",
      "La televisión"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "La revolución industrial permitió mejorar la impresión y reducir costos, haciendo más accesible la ilustración en libros."
  },
  {
    "id": 712,
    "question": "¿Qué caracteriza a los libros-objeto o libros de artista?",
    "options": [
      "Utilizan exclusivamente papel reciclado",
      "Rompen con la estructura tradicional del libro",
      "Solo contienen ilustraciones religiosas",
      "Tienen exclusivamente texto sin imágenes"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El libro-objeto rompe la estructura convencional del libro, convirtiéndose en una obra artística visual y conceptual."
  },
  {
    "id": 713,
    "question": "¿Cuál fue la primera novela en utilizar imágenes fotográficas con propósito estético?",
    "options": [
      "Fugues",
      "Bruges-la-Morte",
      "Droit de regards",
      "Twilight"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "‘Bruges-la-Morte’ de Georges Rodenbach, publicada en 1892, es reconocida como la primera novela en usar fotografías con intención estética."
  },
  {
    "id": 714,
    "question": "¿Qué elemento distingue a las novelas visuales de otros formatos?",
    "options": [
      "Se leen de atrás hacia adelante",
      "Utilizan gráficos 3D en tiempo real",
      "Permiten interacción del lector mediante decisiones",
      "Están escritas en verso"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Las novelas visuales permiten al jugador tomar decisiones que afectan el curso de la historia."
  },
  {
    "id": 715,
    "question": "¿Qué define a la novela gráfica según Gómez (2013)?",
    "options": [
      "Relatos simples y cómicos para niños",
      "Obras literarias adultas, autoconclusivas y con temas serios",
      "Historias sin narrativa visual",
      "Solo contienen imágenes sin texto"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Gómez (2013) describe la novela gráfica como obras literarias adultas, autoconclusivas y de autor, que tratan temas serios."
  },
  {
    "id": 716,
    "question": "¿Qué plataforma española facilita partidas de rol online?",
    "options": [
      "Nivel20",
      "Twine",
      "Steam",
      "Discord"
    ],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Nivel20 es una plataforma española que permite gestionar partidas de rol online."
  },
  {
    "id": 717,
    "question": "¿Qué es un LARP?",
    "options": [
      "Juego de mesa tradicional",
      "Juego de cartas coleccionables",
      "Juego de rol en vivo",
      "Podcast de ficción"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "LARP (Live Action Role Playing) es un tipo de juego de rol en el que los participantes interpretan físicamente sus personajes."
  },
  {
    "id": 718,
    "question": "¿Qué herramienta permite crear historias interactivas sin saber programar?",
    "options": [
      "Audacity",
      "Premiere Pro",
      "Twine",
      "Photoshop"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Twine permite crear historias interactivas con múltiples caminos sin necesidad de conocimientos de programación."
  },
  {
    "id": 719,
    "question": "¿Qué distingue al podcast de la radio tradicional?",
    "options": [
      "Solo transmite en vivo",
      "Se escucha en cines",
      "Permite consumo a demanda y en cualquier momento",
      "Solo funciona en iPods"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El podcast permite escuchar contenido cuando el usuario lo desea, transformando el consumo de audio."
  },
  {
    "id": 720,
    "question": "¿Qué término define al usuario que consume y produce contenido en la web 2.0?",
    "options": [
      "Streamer",
      "Prosumer",
      "Influencer",
      "Editor"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El término ‘prosumer’, acuñado por Alvin Toffler, describe a los usuarios que consumen y también producen contenido."
  },
  {
    "id": 721,
    "question": "¿Cuál es una característica esencial de los juegos de rol de mesa?",
    "options": [
      "Uso de auriculares",
      "Lectura silenciosa",
      "Narración colectiva guiada por un director de juego",
      "Partidas individuales"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Los juegos de rol de mesa consisten en una historia colectiva guiada por un director de juego."
  },
  {
    "id": 722,
    "question": "¿Qué función tiene el ‘game master’ en un juego de rol de mesa?",
    "options": [
      "Crear fichas de personajes",
      "Repartir los dados",
      "Narrar la historia y controlar los eventos del juego",
      "Espectador pasivo"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El game master narra la historia, describe el entorno, controla a los PNJs y guía el desarrollo del juego."
  },
  {
    "id": 723,
    "question": "¿Qué distingue al álbum ilustrado de otros libros ilustrados?",
    "options": [
      "Está dirigido solo a adultos",
      "Contiene ensayos filosóficos",
      "La imagen tiene un papel primordial en la narrativa",
      "No tiene texto"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "En el álbum ilustrado, la imagen juega un papel fundamental en el desarrollo de la historia."
  },
  {
    "id": 724,
    "question": "¿Qué tipo de historias solían abordar tradicionalmente las foto-novelas?",
    "options": [
      "Ciencia ficción",
      "Novela rosa",
      "Terror psicológico",
      "Biografías"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Tradicionalmente, las foto-novelas trataban historias románticas dirigidas a un público femenino."
  },
  {
    "id": 725,
    "question": "¿Qué formato combina audio con contenido audiovisual para una experiencia envolvente?",
    "options": [
      "Podcast tradicional",
      "Video-podcast",
      "Entrevista radial",
      "Audiolibro"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El video-podcast combina audio y video, haciéndolo más atractivo y versátil para distintas plataformas."
  },
  {
    "id": 726,
    "question": "¿Qué permitió el surgimiento de la figura del prosumidor?",
    "options": [
      "La imprenta",
      "La Web 2.0",
      "La televisión por cable",
      "El cine mudo"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "La Web 2.0 facilitó la participación activa de los usuarios en la creación de contenido."
  },
  {
    "id": 727,
    "question": "¿Qué aspecto caracteriza a los juegos de rol online respecto a los tradicionales?",
    "options": [
      "No tienen historia",
      "No requieren personajes",
      "Usan mapas interactivos y efectos de sonido",
      "Solo pueden jugarse en papel"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Los juegos de rol online incorporan herramientas multimedia que enriquecen la experiencia."
  },
  {
    "id": 728,
    "question": "¿Qué define a un motion comic?",
    "options": [
      "Novela gráfica con aroma",
      "Libro en braille para ciegos",
      "Cómic con animaciones y sonido",
      "Película sin imagen"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Un motion comic es un cómic digital con animaciones y efectos sonoros que amplifican la experiencia narrativa."
  },
  {
    "id": 729,
    "question": "¿Qué caracteriza a las ficciones sonoras en los podcasts?",
    "options": [
      "Lectura de textos legales",
      "Películas para los oídos",
      "Diarios personales",
      "Música sin letra"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Las ficciones sonoras son historias dramatizadas en audio, similares a una película sin imagen."
  },
  {
    "id": 730,
    "question": "¿Qué elemento permitió la expansión del fenómeno podcast en su origen?",
    "options": [
      "Los tocadiscos",
      "La televisión por satélite",
      "El iPod",
      "El fax"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "El iPod facilitó la popularización del podcast al permitir el consumo portátil de archivos de audio."
  },
   {
    "id": 731,
    "question": "¿Qué se entiende por narrativa transmedia?",
    "options": [
      "Una historia que se repite en distintos medios sin cambios",
      "Una narrativa que se adapta a distintos idiomas",
      "Una historia que se expande a través de múltiples medios, aportando contenidos diferentes en cada uno",
      "Un único relato contado en forma de libro y cómic al mismo tiempo"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "La narrativa transmedia expande una historia mediante diferentes medios, aportando partes únicas en cada uno que enriquecen el universo narrativo."
  },
  {
    "id": 732,
    "question": "¿Cuál de las siguientes opciones es un ejemplo claro de narrativa transmedia?",
    "options": [
      "Una novela que luego se convierte en película con el mismo guion",
      "Una película, una serie y un videojuego que cuentan distintas partes de una misma historia",
      "Una canción con videoclip",
      "Una obra traducida a múltiples idiomas"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Cuando distintos medios (película, serie, videojuego) aportan partes únicas del relato, se configura un ejemplo de narrativa transmedia."
  },
  {
    "id": 733,
    "question": "¿Qué rol tienen los usuarios en una narrativa transmedia?",
    "options": [
      "Solo observan la historia de forma pasiva",
      "Pueden consumir una parte y comprender todo",
      "Participan activamente descubriendo y compartiendo contenido entre plataformas",
      "Solo actúan como compradores de merchandising"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Los usuarios en una narrativa transmedia se convierten en exploradores activos del contenido, descubriendo e incluso creando piezas del universo narrativo."
  },
  {
    "id": 734,
    "question": "¿Qué ventaja ofrece una estrategia transmedia en el mercado cultural?",
    "options": [
      "Reduce costos de producción",
      "Limita el consumo a un solo público",
      "Permite mayor engagement al diversificar la experiencia",
      "Evita la fragmentación de audiencias"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Una estrategia transmedia permite aumentar el engagement al ofrecer experiencias variadas y complementarias en distintos medios."
  },
  {
    "id": 735,
    "question": "¿Qué diferencia principal hay entre una adaptación y una narrativa transmedia?",
    "options": [
      "La adaptación solo ocurre en videojuegos",
      "La narrativa transmedia aporta nuevas piezas narrativas en cada medio",
      "Ambas son idénticas",
      "La adaptación es exclusiva del cine"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "2.0",
    "explanation": "Mientras que una adaptación traslada una historia al nuevo medio sin alterarla, la narrativa transmedia añade elementos originales en cada soporte."
  },
  
  





   {
    "id": 736,
    "question": "¿Qué característica principal distingue al webdoc del documental tradicional?",
    "options": ["Narración lineal", "Presencia de un narrador omnisciente", "Interactividad", "Duración limitada"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La interactividad es lo que define al webdoc, permitiendo al usuario decidir qué partes explorar."
  },
  {
    "id": 737,
    "question": "¿Cuál es una característica típica de la estructura de los webdocs?",
    "options": ["Continuidad narrativa", "Fragmentación modular", "Resolución cinematográfica", "Ausencia de hipervínculos"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Los webdocs se componen de módulos o fragmentos que el espectador elige explorar."
  },
  {
    "id": 738,
    "question": "¿En qué década se consolidan los webdocs como un formato reconocible?",
    "options": ["Década de 1980", "Década de 1990", "2000-2010", "2010-actualidad"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La consolidación de los webdocs se sitúa entre los años 2000 y 2010."
  },
  {
    "id": 739,
    "question": "¿Qué estructura interactiva organiza contenidos por temas o espacios?",
    "options": ["Narrativa", "Categórica", "Colaborativa", "Concéntrica"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La estructura categórica presenta vídeos breves organizados por temas."
  },
  {
    "id": 740,
    "question": "¿Cuál de las siguientes estructuras permite al usuario aportar contenido?",
    "options": ["Narrativa", "Categórica", "Colaborativa", "Ramificada"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La estructura colaborativa se caracteriza por permitir la participación del usuario."
  },
  {
    "id": 741,
    "question": "¿Qué tecnología favorece la inmersión al permitir una visión completa del entorno?",
    "options": ["Video HD", "360°", "GIFs interactivos", "Nodos ramificados"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La grabación en 360° permite una inmersión mayor al simular la presencia física."
  },
  {
    "id": 742,
    "question": "¿Cuál es una de las temáticas más frecuentes en los webdocs?",
    "options": ["Ciencia ficción", "Cultura popular japonesa", "Ecología", "Fútbol"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Ecología es una temática habitual en los webdocs por su enfoque autoral y crítico."
  },
  {
    "id": 743,
    "question": "¿Qué narrativa implica nodos adyacentes que regresan al núcleo central?",
    "options": ["Lineal", "Espina de pescado", "Paralela", "Concéntrica"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa espina de pescado regresa siempre al hilo central del documental."
  },
  {
    "id": 744,
    "question": "¿Cuál de estas herramientas se utiliza comúnmente para el diseño gráfico del webdoc?",
    "options": ["After Effects", "Photoshop", "DaVinci Resolve", "Audition"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Photoshop es clave para crear elementos visuales coherentes en la interfaz del webdoc."
  },
  {
    "id": 745,
    "question": "¿Qué aporta la gamificación al documental interactivo?",
    "options": ["Reducir costos de producción", "Recompensas y motivación", "Mayor duración", "Narración más simple"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La gamificación aporta mecánicas de recompensa que estimulan la participación del usuario."
  },
  {
    "id": 746,
    "question": "¿Qué tipo de narrativa permite múltiples finales dependiendo de las decisiones del usuario?",
    "options": ["Concéntrica", "Ramificada", "Paralela", "Hilada"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa ramificada maximiza la interactividad ofreciendo múltiples finales."
  },
  {
    "id": 747,
    "question": "¿Qué aspecto complica la estructura narrativa de un webdoc?",
    "options": ["Duración fija", "Presencia de actores", "Co-creación del usuario", "Presupuesto limitado"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La co-creación del usuario introduce múltiples trayectorias y decisiones en la narrativa."
  },
  {
    "id": 748,
    "question": "¿Qué formato antecedió al webdoc durante los años 80 y 90?",
    "options": ["Blu-Ray", "Video Disc y CD-ROM", "DVD", "Flash interactivo"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Los formatos ópticos como Video Disc y CD-ROM fueron precursores museísticos del webdoc."
  },
  {
    "id": 749,
    "question": "¿Cuál de estas herramientas se usa habitualmente para edición en postproducción?",
    "options": ["Unity", "Audacity", "Final Cut", "ZBrush"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Final Cut es uno de los principales softwares para editar documental interactivo."
  },
  {
    "id": 750,
    "question": "¿Qué enfoque estructural narra a través de múltiples perspectivas individuales?",
    "options": ["Espacio", "Tiempo", "Personajes", "Eventos"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "El enfoque basado en personajes permite explorar la historia desde varias voces."
  },
  {
    "id": 751,
    "question": "¿Qué estructura narrativa ofrece libertad inicial pero final único?",
    "options": ["Lineal", "Hilada", "Paralela", "Concéntrica"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa hilada converge en un único final pese a las decisiones del usuario."
  },
  {
    "id": 752,
    "question": "¿Qué software se emplea para tratamiento profesional de sonido?",
    "options": ["After Effects", "Photoshop", "Premiere", "ProTools"],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "ProTools es una herramienta profesional para el procesamiento de sonido en postproducción."
  },
  {
    "id": 753,
    "question": "¿Qué elemento NO es característico de un webdoc?",
    "options": ["Interactividad", "Narración cerrada", "Fragmentación", "Hibridación multimedia"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narración cerrada es típica de documentales lineales, no de webdocs."
  },
  {
    "id": 754,
    "question": "¿Qué narrativa se caracteriza por tener un hilo central con ramificaciones que siempre regresan?",
    "options": ["Concéntrica", "Espina de pescado", "Paralela", "Ramificada"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa espina de pescado mantiene la estructura conectada a un núcleo."
  },
  {
    "id": 755,
    "question": "¿Qué permite la narrativa paralela en un webdoc?",
    "options": ["Evitar la interacción", "Seguir una sola línea de tiempo", "Equilibrar libertad y experiencia compartida", "Crear bucles infinitos"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa paralela permite rutas alternativas pero con nodos compartidos, equilibrando libertad e interacción común."
  },
  {
    "id": 755,
    "question": "¿Qué función cumple la interfaz en un webdoc?",
    "options": ["Actuar como narrador", "Distribuir la narrativa lineal", "Facilitar la experiencia del usuario", "Elaborar los efectos especiales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La interfaz organiza la navegación y permite que el usuario interactúe con los contenidos del documental."
  },
  {
    "id": 756,
    "question": "¿Cuál de los siguientes es un beneficio de la narrativa no lineal en los webdocs?",
    "options": ["Evita el uso de tecnología", "Favorece la inmersión y la exploración", "Limita la creatividad del usuario", "Facilita el análisis estadístico"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa no lineal permite al usuario explorar diferentes trayectorias, generando una experiencia más personalizada."
  },
  {
    "id": 757,
    "question": "¿Qué caracteriza al enfoque espacial en la narrativa del webdoc?",
    "options": ["Se centra en los cambios temporales", "Se basa en ubicaciones geográficas", "Sigue un personaje a lo largo del tiempo", "Usa estructuras tradicionales de cine"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "El enfoque espacial organiza la narrativa a través de entornos o ubicaciones geográficas."
  },
  {
    "id": 758,
    "question": "¿Cuál es uno de los desafíos técnicos de los webdocs?",
    "options": ["Falta de contenido multimedia", "Poca interactividad", "Gestión de múltiples rutas narrativas", "Incompatibilidad con video"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "Los webdocs requieren una planificación compleja para gestionar las rutas narrativas posibles."
  },
  {
    "id": 759,
    "question": "¿Qué elemento multimedia suele integrarse en los webdocs para potenciar el realismo?",
    "options": ["Dibujos animados", "Infografías estáticas", "Audio ambiente y video real", "Gráficos vectoriales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "El audio ambiente y el video documental refuerzan la sensación de realidad y presencia."
  },
  {
    "id": 760,
    "question": "¿Qué tipo de narrativa se apoya en ejes temáticos que no necesariamente se conectan entre sí?",
    "options": ["Concéntrica", "Ramificada", "Categórica", "Hilada"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa categórica ofrece piezas temáticas independientes que el usuario puede explorar sin orden específico."
  },
  {
    "id": 761,
    "question": "¿Cuál es una función clave del diseño sonoro en un documental interactivo?",
    "options": ["Reducir tiempos de carga", "Generar tensión narrativa", "Sustituir la imagen", "Eliminar la necesidad de interacción"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "El diseño sonoro ayuda a construir atmósferas, emociones y a guiar al usuario en la experiencia."
  },
  {
    "id": 762,
    "question": "¿Qué diferencia a la narrativa concéntrica de otras estructuras?",
    "options": ["No tiene nodo principal", "Permite múltiples finales", "Tiene un eje central y nodos que regresan a él", "Es completamente lineal"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La narrativa concéntrica siempre regresa a un núcleo común que organiza toda la estructura."
  },
  {
    "id": 763,
    "question": "¿Por qué se considera al webdoc un formato híbrido?",
    "options": ["Combina documental, ficción y videojuegos", "Solo usa texto e imagen", "Se transmite por televisión", "No incluye audio ni video"],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "El webdoc integra elementos del documental, la narrativa interactiva y, a veces, incluso de los videojuegos."
  },
  {
    "id": 764,
    "question": "¿Qué rol tiene la audiencia en un documental interactivo?",
    "options": ["Papel pasivo de observador", "Solo escucha", "Rol activo y participativo", "Solo sigue instrucciones lineales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "3.0",
    "explanation": "La audiencia en un webdoc toma decisiones, elige rutas y puede incluso contribuir con contenido."
  },
  {
    "id": 765,
    "question": "¿Cuál es la característica principal del pacto ficcional?",
    "options": ["Se basa en hechos reales", "Engaña al espectador sin que lo sepa", "El espectador acepta que la historia es inventada", "Evita cualquier tipo de invención"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "El pacto ficcional implica que el espectador sabe que lo que ve o lee es ficción y acepta entrar en ese juego."
  },
  {
    "id": 766,
    "question": "¿Qué diferencia fundamental existe entre ficción y no ficción?",
    "options": ["El uso del diálogo", "El propósito narrativo", "La intención de engañar o no al espectador", "La duración del relato"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La ficción implica un 'engaño consentido', mientras que la no ficción se basa en el pacto de verdad."
  },
  {
    "id": 767,
    "question": "Según Aristóteles, ¿qué es preferible en una historia de ficción?",
    "options": ["Un hecho imposible pero creíble", "Un hecho posible pero inverosímil", "Solo hechos reales", "Ficción sin lógica interna"],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Aristóteles valoraba más la verosimilitud interna de la ficción que su coincidencia con la realidad."
  },
  {
    "id": 768,
    "question": "¿Cuál de los siguientes casos es un ejemplo de confusión entre ficción y realidad?",
    "options": ["Matrix (1999)", "Orson Welles y 'La guerra de los mundos'", "Inception (2010)", "2001: Una odisea del espacio"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "En 1938, la emisión radial de Welles fue tomada como un boletín real, generando pánico."
  },
  {
    "id": 769,
    "question": "¿Qué caracteriza a los 'mockumentaries'?",
    "options": ["Documentales reales con toques de humor", "Ficción que imita el estilo documental", "Noticias falsas presentadas como humor", "Autobiografías interactivas"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Los mockumentaries son obras de ficción que adoptan el formato documental, como 'The Blair Witch Project'."
  },
  {
    "id": 770,
    "question": "¿Qué implica la etiqueta 'basado en hechos reales'?",
    "options": ["Que todo es absolutamente cierto", "Que solo se usan datos científicos", "Una mezcla de realidad y ficción con pacto ambiguo", "Que los personajes son reales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Esta etiqueta busca ganar credibilidad, aunque muchas veces incluye elementos de ficción."
  },
  {
    "id": 771,
    "question": "¿Qué busca la 'fake news' que la diferencia de la ficción tradicional?",
    "options": ["Informar al ciudadano", "Provocar reflexión crítica", "Engañar al receptor intencionadamente", "Educar con entretenimiento"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Las fake news no tienen pacto ficcional: buscan hacer pasar la mentira como verdad."
  },
  {
    "id": 772,
    "question": "¿Qué término describe cuando el autor se presenta a sí mismo como personaje dentro de una obra?",
    "options": ["Metaficción", "Biografía", "Autoficción", "No ficción subjetiva"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La autoficción mezcla la autobiografía con elementos ficticios, difuminando la frontera entre verdad y ficción."
  },
  {
    "id": 773,
    "question": "¿Cuál es un riesgo de la posverdad en los medios digitales?",
    "options": ["Aumentar la participación del público", "Mejorar la alfabetización digital", "Reforzar creencias sin base real", "Facilitar la educación interactiva"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La posverdad se basa en apelar a emociones más que a hechos comprobables, lo cual puede reforzar ideas falsas."
  },
  {
    "id": 774,
    "question": "¿Qué provoca la combinación de ficción y no ficción en nuevos medios digitales?",
    "options": ["Reducción del interés por el documental", "Mayor precisión factual", "Experiencias híbridas que mezclan entretenimiento y educación", "Pérdida total de verosimilitud"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Estas narrativas digitales híbridas generan impacto emocional y cognitivo al jugar con la frontera entre verdad y ficción."
  },
  {
    "id": 775,
    "question": "¿Qué elemento debe respetar una historia de ficción para ser verosímil?",
    "options": ["Que sea basada en hechos reales", "Que incluya datos contrastados", "Que sea coherente con su propio universo narrativo", "Que tenga un narrador en primera persona"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La verosimilitud en la ficción implica que los eventos sean creíbles dentro de las reglas del mundo que presenta."
  },
  {
    "id": 776,
    "question": "¿Qué tienen en común 'Operación Palace' y 'The Blair Witch Project'?",
    "options": ["Ambas son noticias reales convertidas en películas", "Son ejemplos de autoficción", "Son falsos documentales que parecen reales", "Son parodias de documentales históricos"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Ambas obras son mockumentaries: producciones ficticias que imitan el estilo documental para parecer reales."
  },
  {
    "id": 777,
    "question": "¿Cuál es una consecuencia posible del uso irresponsable del formato documental en ficción?",
    "options": ["Mejora la educación del espectador", "Refuerza la credibilidad de los medios", "Genera confusión entre realidad y ficción", "Aumenta la objetividad narrativa"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Cuando se usa el formato documental sin aclarar su ficción, puede llevar a los espectadores a creer que todo lo presentado es real."
  },
  {
    "id": 778,
    "question": "¿Qué ocurrió con el público ante la emisión de 'La guerra de los mundos' por Orson Welles en 1938?",
    "options": ["Comprendió que era ficción desde el principio", "Ignoró el contenido", "Muchos creyeron que era una invasión real", "Solo los críticos literarios la valoraron"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La emisión se presentó como un boletín informativo, lo que provocó el pánico de miles de oyentes que pensaron que era real."
  },
  {
    "id": 779,
    "question": "¿Qué función cumple la verosimilitud en una obra de ficción?",
    "options": ["Evitar cualquier contradicción factual", "Asegurar la objetividad del relato", "Convencer al público de que lo narrado podría ser posible", "Cumplir con la estructura del documental clásico"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La verosimilitud no exige realidad, sino coherencia interna para que el público 'crea' en lo que está viendo."
  },
  {
    "id": 780,
    "question": "¿Qué papel juegan las emociones en la era de la posverdad?",
    "options": ["Se minimizan en favor de los hechos", "Sirven para engañar al espectador intencionadamente", "Sustituyen los datos objetivos como base de creencias", "Se excluyen de las narrativas digitales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La posverdad se apoya en lo emocional, haciendo que la gente crea en algo aunque no sea cierto, solo porque se ajusta a sus sentimientos."
  },
  {
    "id": 781,
    "question": "¿Por qué la frontera entre ficción y no ficción es cada vez más borrosa?",
    "options": ["Porque ya no existen normas narrativas", "Por el uso de inteligencia artificial", "Por el auge de híbridos narrativos que mezclan ambas formas", "Porque los medios tradicionales han desaparecido"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La expansión de formatos mixtos, como autoficción, mockumentaries y narrativas digitales, diluye la separación entre realidad e invención."
  },
  {
    "id": 782,
    "question": "¿Qué puede provocar el uso del rótulo 'basado en hechos reales' en una obra de ficción?",
    "options": ["Mayor confusión sobre la veracidad de los hechos", "Evitar la empatía del público", "Reducir el impacto emocional", "Eliminar toda ficción del relato"],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "El rótulo suele aumentar la credibilidad, aunque puede confundir sobre qué parte es ficción y cuál es realidad."
  },
  {
    "id": 783,
    "question": "¿Qué diferencia a la autoficción de otros géneros narrativos?",
    "options": ["Incluye exclusivamente datos objetivos", "Usa un formato documental estricto", "El autor se presenta como personaje de su propia historia", "No admite ningún elemento inventado"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La autoficción juega con la identidad del autor, mezclando su vida real con elementos inventados de manera intencionada."
  },
  {
    "id": 784,
    "question": "¿Qué ocurre cuando la realidad se distorsiona para parecer más creíble que la verdad?",
    "options": ["Se refuerza el pensamiento crítico", "Se produce un fenómeno de hiperrealidad", "Se evita la posverdad", "Se genera verosimilitud objetiva"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Este fenómeno se conoce como hiperrealidad, donde la representación es más convincente o creíble que la realidad misma."
  },
  {
    "id": 785,
    "question": "¿Qué tipo de pacto acepta el espectador en una obra de ficción?",
    "options": ["Pacto de veracidad", "Pacto informativo", "Pacto ficcional", "Pacto testimonial"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "En la ficción se establece un 'pacto ficcional': el espectador acepta que lo que ve no es real, pero lo disfruta como si lo fuera."
  },
  {
    "id": 786,
    "question": "¿Cuál es la principal característica de la no ficción?",
    "options": ["Incluye elementos fantásticos", "Se basa en datos y hechos verificables", "Utiliza actores famosos", "Permite la ambigüedad narrativa"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La no ficción se fundamenta en hechos reales y datos comprobables, con un compromiso de veracidad con el lector o espectador."
  },
  {
    "id": 787,
    "question": "¿Qué autor afirmó que 'es mejor un imposible creíble que un posible inverosímil'?",
    "options": ["Sócrates", "Aristóteles", "Cicerón", "Descartes"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Aristóteles defendía la verosimilitud en la ficción como un elemento esencial, incluso por encima de la realidad literal."
  },
  {
    "id": 788,
    "question": "¿Cuál de las siguientes obras se considera un ejemplo de autoficción?",
    "options": ["The Blair Witch Project", "Fargo", "Caro diario", "Rec"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "'Caro diario' es una obra de autoficción, donde el autor se muestra a sí mismo como personaje, borrando la frontera entre realidad y ficción."
  },
  {
    "id": 789,
    "question": "¿Qué caracteriza a las fake news frente a la ficción?",
    "options": ["Fingir sin engañar", "Narración desde lo emocional", "Ausencia de veracidad", "Búsqueda activa de engaño"],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Las fake news no forman parte de un pacto ficcional: su objetivo es manipular y engañar al receptor haciéndole creer que es información real."
  },
  {
    "id": 790,
    "question": "¿Qué ocurre cuando el público no sabe que está viendo ficción?",
    "options": ["Se incrementa la tensión narrativa", "Se pierde interés", "Puede generarse confusión o pánico", "Se favorece la empatía con los personajes"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Cuando se disfraza la ficción de realidad, como ocurrió con 'La guerra de los mundos', puede haber consecuencias graves como el pánico social."
  },
  {
    "id": 791,
    "question": "¿Qué relación existe entre verosimilitud y creencias personales?",
    "options": ["Ninguna, son independientes", "La verosimilitud se basa en datos objetivos", "La verosimilitud puede reforzarse si encaja con las creencias del espectador", "Solo importa en documentales"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Si una historia coincide con nuestras creencias, puede parecernos más verosímil aunque no sea cierta."
  },
  {
    "id": 792,
    "question": "¿Qué efecto tiene la narrativa interactiva sobre la percepción de realidad y ficción?",
    "options": ["La refuerza", "La diluye y mezcla", "La hace más objetiva", "La elimina por completo"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "En medios digitales, la interacción refuerza la mezcla de elementos reales y ficticios, generando una experiencia más ambigua y compleja."
  },
  {
    "id": 793,
    "question": "¿Cuál es un objetivo típico de los híbridos entre ficción y no ficción?",
    "options": ["Generar confusión legal", "Educar y entretener al mismo tiempo", "Imitar noticias falsas", "Eliminar la narración emocional"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Estos formatos buscan generar impacto combinando el valor educativo de lo real con la capacidad emocional de la ficción."
  },
  {
    "id": 794,
    "question": "¿Qué función cumple el 'pacto de verdad' en la no ficción?",
    "options": ["Asegura que se usen efectos especiales", "Promete una experiencia estética", "Compromete al autor a relatar hechos reales", "Implica narrar desde un punto de vista ficcional"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "En la no ficción, el pacto de verdad implica un compromiso con la fidelidad a los hechos y la transparencia de las fuentes."
  },
   {
    "id": 795,
    "question": "¿Qué evento tecnológico tuvo lugar en 1984 durante la Super Bowl?",
    "options": [
      "Lanzamiento del navegador Netscape",
      "Primera aparición pública de Facebook",
      "Primer conflicto mediático de Apple",
      "Presentación de Google"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "En 1984, Apple lanzó su icónico anuncio de Macintosh durante la Super Bowl, considerado el primer gran conflicto mediático entre Apple y el sistema establecido."
  },
  {
    "id": 796,
    "question": "¿En qué año se produce la denuncia de Apple por su interfaz gráfica?",
    "options": ["1984", "1988", "1991", "1994"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "En 1988, Apple fue denunciada por el uso de una interfaz gráfica, lo que marcó un conflicto legal en la evolución del diseño de software."
  },
  {
    "id": 797,
    "question": "¿Qué inventó Tim Berners-Lee en 1991 mientras trabajaba en el CERN?",
    "options": ["El sistema operativo Linux", "La primera red social", "La primera página web", "El correo electrónico"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "En 1991, Berners-Lee creó la primera página web desde el CERN, dando origen a la World Wide Web."
  },
  {
    "id": 798,
    "question": "¿Qué navegador aparece en 1994?",
    "options": ["Internet Explorer", "Firefox", "Netscape", "Safari"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Netscape apareció en 1994 y fue uno de los primeros navegadores web ampliamente adoptados."
  },
  {
    "id": 799,
    "question": "¿Qué empresa compra Netscape en 1998?",
    "options": ["Microsoft", "Amazon", "Apple", "America Online (AOL)"],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "America Online (AOL) adquirió Netscape en 1998, en un intento de fortalecerse en el mercado de internet."
  },
  {
    "id": 800,
    "question": "¿En qué año se fundó Google?",
    "options": ["1996", "1998", "2000", "2004"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Google fue fundado en 1998 por Larry Page y Sergey Brin."
  },
  {
    "id": 801,
    "question": "¿Cuándo se lanza oficialmente Facebook?",
    "options": ["2002", "2003", "2004", "2005"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Facebook se lanzó en 2004, inicialmente como una red universitaria en Harvard."
  },
  {
    "id": 802,
    "question": "¿Qué herramienta de publicidad lanza Google en el año 2000?",
    "options": ["Google Ads", "Google AdWords", "AdSense", "Google Analytics"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "En 2000, Google lanza AdWords, su plataforma de publicidad orientada a búsquedas."
  },
  {
    "id": 803,
    "question": "¿Qué navegador lanza Google en 2008?",
    "options": ["Firefox", "Internet Explorer", "Chrome", "Opera"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Google Chrome fue lanzado en 2008 como un navegador rápido y minimalista."
  },
  {
    "id": 804,
    "question": "¿Qué red social nació en 2006 y se centra en mensajes cortos?",
    "options": ["YouTube", "Flickr", "MySpace", "Twitter"],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Twitter se fundó en 2006, popularizándose por su formato de microblogging con mensajes breves."
  },
  {
    "id": 805,
    "question": "¿En qué año tuvo lugar el encuentro entre Tim Berners-Lee y Marc Andreessen?",
    "options": ["1991", "1993", "1995", "1997"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "El encuentro entre Berners-Lee (inventor de la web) y Andreessen (desarrollador de Mosaic/Netscape) se produjo en 1993."
  },
  {
    "id": 806,
    "question": "¿En qué año lanzó Bill Gates su primer navegador web?",
    "options": ["1993", "1994", "1995", "1996"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Bill Gates introdujo el navegador Internet Explorer como respuesta a Netscape en 1994."
  },
  {
    "id": 807,
    "question": "¿Qué versión de Internet Explorer se lanza en 1997?",
    "options": ["IE 2.0", "IE 3.5", "IE 4.0", "IE 5.0"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Internet Explorer 4.0 se lanzó en 1997, marcando un avance importante en la guerra de los navegadores."
  },
  {
    "id": 808,
    "question": "¿Qué red social fue lanzada en 2004 junto a Facebook?",
    "options": ["MySpace", "LinkedIn", "Flickr", "Twitter"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "LinkedIn fue lanzada en 2004, el mismo año que Facebook, pero con un enfoque profesional."
  },
  {
    "id": 809,
    "question": "¿En qué año se creó MySpace?",
    "options": ["2001", "2002", "2003", "2004"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "MySpace se lanzó en 2003 y rápidamente se convirtió en la red social más popular antes de la llegada de Facebook."
  },
  {
    "id": 810,
    "question": "¿Qué servicio para compartir imágenes fue lanzado en 2004?",
    "options": ["Instagram", "Flickr", "Picasa", "Snapchat"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Flickr fue lanzado en 2004 y se convirtió en una de las primeras plataformas importantes para compartir fotos online."
  },
  {
    "id": 811,
    "question": "¿En qué año nació YouTube?",
    "options": ["2004", "2005", "2006", "2007"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "YouTube fue fundado en 2005 y revolucionó la forma de consumir y compartir vídeos en Internet."
  },
  {
    "id": 812,
    "question": "¿Qué red social popular por su microblogging nació en 2006?",
    "options": ["Facebook", "Flickr", "Twitter", "Instagram"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Twitter, lanzada en 2006, introdujo el formato de microblogging con tuits de 140 caracteres."
  },
  {
    "id": 813,
    "question": "¿Qué herramienta publicitaria de Google comenzó a funcionar en el año 2000?",
    "options": ["Google Ads", "AdWords", "AdSense", "DoubleClick"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Google AdWords, lanzado en 2000, revolucionó el marketing digital basado en búsquedas y clics."
  },
  {
    "id": 814,
    "question": "¿Qué navegador sustituyó a Netscape y fue clave para Google en 2008?",
    "options": ["Firefox", "Chrome", "Edge", "Safari"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "dates",
    "explanation": "Google Chrome fue lanzado en 2008 y rápidamente se convirtió en el navegador más utilizado del mundo."
  },
   {
    "id": 815,
    "question": "¿Cuál de los siguientes NO es uno de los cuatro puntales de la comunicación digital?",
    "options": ["Contenido", "Conversación", "Conexión", "Comunidad"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Los cuatro puntales son Contenido, Conversación, Comunidad y Comercio. 'Conexión' no forma parte de esta lista."
  },
  {
    "id": 816,
    "question": "¿Qué función del narrador digital se relaciona con permitir al usuario elegir rutas de navegación?",
    "options": ["Interactividad", "Personalización", "Hipertextualidad", "Diseño"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La hipertextualidad permite crear enlaces y caminos no lineales dentro de una narrativa digital."
  },
  {
    "id": 817,
    "question": "¿Qué elemento es clave para mantener coherencia en la comunicación digital?",
    "options": ["Frecuencia de publicaciones", "Estilo consistente", "Uso de hashtags", "Análisis de métricas"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Definir un estilo consistente asegura una identidad clara y reconocible en todos los canales."
  },
  {
    "id": 818,
    "question": "¿Qué se busca al identificar prescriptores en una estrategia digital?",
    "options": ["Aumentar presupuesto", "Mejorar diseño gráfico", "Ampliar alcance e influencia", "Reducir la frecuencia de publicación"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Los prescriptores son personas con influencia en una comunidad que ayudan a difundir el mensaje de forma más efectiva."
  },
  {
    "id": 819,
    "question": "¿Qué función del narrador digital se enfoca en mantener la información actualizada y relevante?",
    "options": ["Interactividad", "Actualización", "Diseño", "Personalización"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La función de actualización implica mantener los contenidos vigentes, adaptados al momento y a las nuevas informaciones."
  },
  {
    "id": 820,
    "question": "¿Cuál de estas acciones es parte del proceso de monitorización del impacto en comunicación digital?",
    "options": ["Crear logotipos", "Publicar sin estrategia", "Escuchar la conversación social", "Eliminar comentarios negativos"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Monitorizar implica observar cómo reacciona la audiencia y participar activamente en las conversaciones."
  },
  {
    "id": 821,
    "question": "¿Qué función del narrador permite adaptar la experiencia a las preferencias del usuario?",
    "options": ["Documentación", "Diseño", "Personalización", "Comunidad"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La personalización consiste en adaptar contenidos o interfaces a las necesidades o gustos del usuario."
  },
  {
    "id": 822,
    "question": "¿Cuál es el primer paso lógico en una estrategia de comunicación digital?",
    "options": ["Monitorizar el impacto", "Publicar contenido", "Establecer objetivos y públicos", "Buscar influencers"],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "Antes de actuar, es esencial definir claramente los objetivos, el público objetivo y los canales adecuados."
  },
  {
    "id": 823,
    "question": "¿Qué puntal de la comunicación digital implica generar interacción y respuesta con la audiencia?",
    "options": ["Comercio", "Conversación", "Comunidad", "Contenido"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La conversación es clave en la comunicación digital bidireccional y se basa en escuchar y responder a la audiencia."
  },
  {
    "id": 824,
    "question": "¿Qué función del narrador digital permite crear relaciones duraderas con los usuarios?",
    "options": ["Interactividad", "Comunidad", "Diseño", "Búsqueda"],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "4.0",
    "explanation": "La función de comunidad permite construir y mantener una red de usuarios comprometidos con la narrativa digital."
  },
  {
    "id": 825,
    "question": "¿Qué implica la alfabetización digital según el enfoque de la Lecture 1?",
    "options": [
      "Solo aprender a escribir en Word",
      "Aprender a leer y escribir con enlaces hipertexto",
      "Crear blogs sin necesidad de leer",
      "Desarrollar habilidades técnicas de hardware"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La alfabetización digital incluye la habilidad de leer y escribir con enlaces hipertexto, no solo habilidades técnicas."
  },
  {
    "id": 826,
    "question": "¿Cuál es una función fundamental del narrador digital según la Lecture 1?",
    "options": [
      "Sustituir al lector",
      "Facilitar el diálogo mediante interactividad",
      "Prohibir la personalización del contenido",
      "Evitar la actualización de contenidos"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El narrador facilita el diálogo a través de la interactividad, permitiendo al usuario interactuar con contenidos y otros usuarios."
  },
  {
    "id": 827,
    "question": "¿Qué representa el uso de enlaces hipertexto en los textos digitales?",
    "options": [
      "Decoración del texto",
      "Interactividad y contexto",
      "Obstáculo para la comprensión",
      "Estilo literario anticuado"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El uso de enlaces proporciona contexto e interactividad, transformando el texto en un mapa navegable."
  },
  {
    "id": 828,
    "question": "¿Qué recomienda García-Noblejas sobre la escritura en internet?",
    "options": [
      "Escribir de cualquier cosa sin importar su dominio",
      "Escribir acerca de lo que sepas y te importe",
      "Imitar siempre a otros escritores",
      "No usar enlaces para no distraer al lector"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "García-Noblejas destaca que se debe escribir sobre temas que uno conoce y que le importan."
  },
  {
    "id": 829,
    "question": "¿Qué función cumple el narrador como 'arquitecto del espacio'?",
    "options": [
      "Diseñar gráficos llamativos",
      "Definir la estructura de navegación",
      "Programar las páginas web",
      "Eliminar la hipertextualidad"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El narrador diseña la estructura de navegación, organizando nodos y enlaces de forma coherente."
  },
  {
    "id": 830,
    "question": "¿Qué destaca Paco Sánchez sobre el aprendizaje de la escritura?",
    "options": [
      "Se aprende escribiendo y leyendo por envidia",
      "Se aprende viendo televisión",
      "Se aprende evitando errores",
      "Solo se aprende con correcciones automatizadas"
    ],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Paco Sánchez afirma que se aprende a escribir escribiendo, leyendo y, en parte, por envidia."
  },
  {
    "id": 831,
    "question": "¿Cuál es la principal moneda de cambio en la economía de atención según la cultura digital?",
    "options": [
      "Los comentarios",
      "Los enlaces",
      "Las imágenes",
      "Los 'likes'"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Los enlaces son considerados moneda de cambio en la economía de atención digital."
  },
  {
    "id": 832,
    "question": "¿Qué tipo de narrativa redefine la función del narrador como facilitador y moderador?",
    "options": [
      "Narrativa oral tradicional",
      "Narrativa hipertextual",
      "Narrativa clásica de novela",
      "Narrativa poética"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La narrativa hipertextual redefine al narrador como organizador de espacios virtuales donde se entabla conversación."
  },
  {
    "id": 833,
    "question": "¿Qué papel tiene el narrador respecto al tiempo en el entorno digital?",
    "options": [
      "Ignora la gestión del tiempo",
      "Gestiona el tiempo en distintas dimensiones (interno, real, usuario)",
      "Solo escribe cronologías",
      "Se encarga únicamente del diseño visual"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El narrador gestiona el tiempo narrativo (cronologías), tiempo real (en vivo) y tiempo del usuario (navegación)."
  },
  {
    "id": 834,
    "question": "¿Cuál es un riesgo de la literatura hipertextual según la Lecture 1?",
    "options": [
      "Exceso de coherencia narrativa",
      "Pérdida de linealidad y sentido de autor",
      "Falta de interacción del lector",
      "Rechazo de las tecnologías digitales"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La literatura hipertextual puede perder coherencia narrativa y disminuir la autoridad del autor en entornos no lineales."
  },
  {
    "id": 835,
    "question": "¿Qué convierte a un documento digital en un 'mapa' para el usuario?",
    "options": [
      "El uso de imágenes animadas",
      "La inclusión de archivos PDF",
      "La organización mediante hipertextos",
      "El uso de fuentes clásicas"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El hipertexto convierte los documentos digitales en mapas interactivos donde los usuarios pueden navegar."
  },
  {
    "id": 836,
    "question": "¿Qué afirmaba García-Noblejas sobre lo correcto en la escritura?",
    "options": [
      "Lo correcto es lo más largo",
      "Lo correcto es lo corregido",
      "Lo correcto es lo más leído",
      "Lo correcto es lo automático"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "García-Noblejas sostenía que lo correcto es aquello que ha sido corregido, destacando la importancia de la revisión."
  },
  {
    "id": 837,
    "question": "¿Qué plataforma mencionada en 2002 se propuso como espacio de aprendizaje y escritura para alumnos?",
    "options": [
      "Facebook",
      "Wikipedia",
      "eCuaderno",
      "Google Docs"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "eCuaderno, en 2002, se convirtió en un ejemplo de uso docente de los blogs como plataforma educativa."
  },
  {
    "id": 838,
    "question": "¿Qué se recomienda hacer antes de que los alumnos creen su propio blog?",
    "options": [
      "Revisar sus deberes",
      "Aprender a programar en HTML",
      "Visitar y analizar blogs recomendados",
      "Memorizar las normas de ortografía"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Los alumnos deben primero analizar blogs sugeridos para entender sus dinámicas antes de crear el propio."
  },
  {
    "id": 839,
    "question": "¿Qué se dice sobre los temas que los alumnos deben abordar en sus blogs?",
    "options": [
      "El docente debe imponer los temas",
      "Es mejor que los alumnos los escojan",
      "Deben centrarse exclusivamente en actualidad",
      "Solo pueden tratar temas personales"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Se recomienda que los alumnos elijan sus temas para evitar la escritura por obligación, lo cual va contra la cultura blog."
  },
  {
    "id": 840,
    "question": "¿Qué actitud deben tener los alumnos respecto a las fuentes utilizadas?",
    "options": [
      "No es necesario citarlas",
      "Solo usarlas si son oficiales",
      "Respetarlas y enlazarlas",
      "Copiar y pegar libremente"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Deben respetar y enlazar las fuentes utilizadas, reconociendo el valor del trabajo ajeno y fomentando la transparencia."
  },
  {
    "id": 841,
    "question": "¿Qué representa el enlace en la economía de atención digital?",
    "options": [
      "Un adorno textual",
      "Una distracción para el lector",
      "Una moneda de cambio",
      "Un error del sistema"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El enlace es visto como moneda de cambio en la economía de atención: 'enlaza y serás enlazado'."
  },
  {
    "id": 842,
    "question": "¿Qué se recomienda en cuanto a correcciones en los blogs estudiantiles?",
    "options": [
      "Corregirlos públicamente en los comentarios",
      "No corregirlos para no desmotivarlos",
      "Corregirlos en privado",
      "Borrar los errores directamente"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Se recomienda hacer correcciones de forma privada para mantener el respeto y el ánimo de los estudiantes."
  },
  {
    "id": 843,
    "question": "¿Qué función tiene Twitter en el contexto de alfabetización digital?",
    "options": [
      "Sirve para distraer a los alumnos",
      "No se recomienda su uso",
      "Es una herramienta complementaria de microblogging",
      "Reemplaza al blog por completo"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Twitter se plantea como una herramienta de microblogging útil en la alfabetización digital y extensión de ideas."
  },
  {
    "id": 844,
    "question": "Según la Lecture 1, ¿a escribir se aprende...?",
    "options": [
      "Solamente con correcciones automáticas",
      "Copiando textos de calidad",
      "Escribiendo, leyendo y con buenos editores",
      "Memorizando reglas gramaticales"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Se aprende escribiendo, leyendo y recibiendo ayuda de editores o lectores críticos."
  },
  {
    "id": 845,
    "question": "¿Cuál es el paso previo necesario antes del hipertexto o la narrativa transmedia?",
    "options": [
      "Tener buen dominio de software de edición",
      "Crear un guion audiovisual",
      "Saber programar páginas web",
      "Una buena historia y una escritura sólida"
    ],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Antes de llegar al hipertexto o a la transmedia, lo fundamental es tener una buena historia bien escrita."
  },
  {
    "id": 846,
    "question": "¿Qué tipo de narrativa requiere equilibrar flexibilidad e interacción con coherencia?",
    "options": [
      "Narrativa hipertextual",
      "Narrativa oral",
      "Narrativa académica",
      "Narrativa simbólica"
    ],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La narrativa hipertextual requiere un equilibrio entre interacción (flexibilidad) y coherencia narrativa."
  },
  {
    "id": 847,
    "question": "¿Cuál es una de las funciones clave del narrador digital según el modelo de Lecture 1?",
    "options": [
      "Eliminar la participación del lector",
      "Organizar la información en nodos",
      "Evitar enlaces externos",
      "Mantener un estilo impersonal"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Una función clave del narrador es organizar el relato en nodos y facilitar la navegación hipertextual."
  },
  {
    "id": 848,
    "question": "¿Qué aportación hace el narrador al contexto informativo del relato?",
    "options": [
      "Ignora el contexto para fomentar ambigüedad",
      "Presenta solo la información principal",
      "Define y proporciona marcos de referencia",
      "Traduce automáticamente los textos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "El narrador digital contextualiza el contenido y define los marcos informativos que lo rodean."
  },
  {
    "id": 849,
    "question": "¿Qué recurso ayuda a resolver la gestión del tiempo interno del relato digital?",
    "options": [
      "GIFs animados",
      "Timelines o cronologías navegables",
      "Listas numeradas",
      "Comentarios de usuarios"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Las cronologías navegables (timelines) son útiles para gestionar el tiempo interno de un relato digital."
  },
  {
    "id": 850,
    "question": "¿Cuál es una de las herramientas para que el narrador gestione el tiempo real?",
    "options": [
      "Enlaces a sitios estáticos",
      "Imágenes fijas",
      "Coberturas en directo minuto a minuto",
      "Animaciones flash"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Las coberturas minuto a minuto permiten que el narrador gestione el tiempo real dentro del relato."
  },
  {
    "id": 851,
    "question": "¿Qué efecto tiene la hipertextualidad en la figura del autor tradicional?",
    "options": [
      "Fortalece su autoridad",
      "La elimina por completo",
      "Debilita su autoridad",
      "La traslada al editor"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La hipertextualidad diluye la figura autoritaria del autor, haciendo que el relato sea más abierto e interactivo."
  },
  {
    "id": 852,
    "question": "¿Qué indica Scolari respecto a la producción transmedia?",
    "options": [
      "Solo los profesionales deben producir contenidos",
      "Los usuarios complementan lo que el productor no puede o no quiere hacer",
      "La transmedia es incompatible con el hipertexto",
      "Los blogs deben evitar la narrativa transmedia"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Scolari afirma que lo que no quiere, no puede o no sabe producir el creador, lo hará el prosumidor."
  },
  {
    "id": 853,
    "question": "¿Cuál fue una de las primeras obras literarias hipertextuales mencionadas?",
    "options": [
      "1984 de Orwell",
      "Afternoon, a story de Joyce",
      "El Aleph de Borges",
      "The Matrix"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "La obra 'Afternoon, a story' de Michael Joyce (1987) es una de las primeras referencias literarias al hipertexto."
  },
  {
    "id": 854,
    "question": "¿Qué relación plantea la Lecture 1 entre videojuegos, redes sociales y escritura hipertextual?",
    "options": [
      "No existe ninguna relación",
      "Los videojuegos y redes son obstáculos para la escritura",
      "Son formas de experiencia lúdica y participativa aplicables a la narrativa",
      "Solo los videojuegos antiguos son útiles"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture1",
    "explanation": "Los videojuegos y las redes sociales representan una experiencia interactiva y participativa, clave en la escritura hipertextual."
  },
  {
    "id": 855,
    "question": "¿Qué transformación trajo la imprenta en términos de acceso a la cultura?",
    "options": [
      "Aumento del comercio internacional",
      "Difusión masiva de información y democratización del acceso cultural",
      "Surgimiento de la televisión como medio dominante",
      "Creación del mercado editorial digital"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La imprenta permitió una difusión masiva de la información y democratizó el acceso a la cultura, marcando un cambio histórico en la comunicación."
  },
  {
    "id": 856,
    "question": "¿Cuál es una característica fundamental de la red respecto a los negocios?",
    "options": [
      "Altas barreras de entrada",
      "Exclusividad en el acceso a la información",
      "Barreras de entrada muy bajas",
      "Restricciones tecnológicas significativas"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La red ofrece barreras de entrada muy bajas, facilitando la participación de nuevos actores en el mercado digital."
  },
  {
    "id": 857,
    "question": "¿Qué implica el paso del capitalismo industrial al informacional?",
    "options": [
      "Mayor uso de materias primas",
      "Énfasis en la mano de obra",
      "Importancia del acceso a la información y datos",
      "Reducción del comercio electrónico"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El capitalismo informacional se basa en el acceso, análisis y gestión de la información más que en la producción física."
  },
  {
    "id": 858,
    "question": "¿Qué deben revisar las empresas al adaptarse a la digitalización?",
    "options": [
      "El equipo de marketing exclusivamente",
      "La localización física de sus oficinas",
      "Las fases de la cadena de valor que podrían verse afectadas",
      "Su presencia en eventos físicos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La digitalización impacta múltiples áreas, por lo que es esencial revisar qué fases de la cadena de valor podrían verse modificadas."
  },
  {
    "id": 859,
    "question": "¿Qué concepto describe al consumidor que también colabora en la producción?",
    "options": [
      "Netripper",
      "Microinfluencer",
      "Prosumer",
      "Stakeholder"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El término 'prosumidor' (prosumer) hace referencia al consumidor que también participa activamente en la producción de bienes o contenidos."
  },
  {
    "id": 860,
    "question": "¿Qué defendía el Manifiesto Cluetrain?",
    "options": [
      "La desactivación de la red como canal empresarial",
      "La publicidad unidireccional",
      "Un nuevo escenario basado en la conversación empresa-consumidor",
      "El abandono de las plataformas digitales"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El Manifiesto Cluetrain proponía un nuevo paradigma en el que la relación empresa-consumidor se transformaba en una conversación horizontal."
  },
  {
    "id": 861,
    "question": "¿Qué debe guiar una estrategia digital efectiva?",
    "options": [
      "La estética visual del sitio web",
      "La cantidad de publicaciones diarias",
      "La alineación entre objetivos, públicos y plataformas digitales",
      "La adopción de todas las redes sociales disponibles"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Una estrategia digital coherente debe basarse en objetivos claros, públicos definidos y el uso adecuado de plataformas relevantes."
  },
  {
    "id": 862,
    "question": "¿Qué paradigma se perfila como sucesor de la Web 2.0?",
    "options": [
      "Paradigma informacional",
      "Paradigma audiovisual",
      "Paradigma de valor y confianza (blockchain)",
      "Paradigma unidireccional"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Después de la Web 2.0, se prevé un paradigma basado en el valor y la confianza, donde tecnologías como blockchain tendrán un papel clave."
  },
  {
    "id": 863,
    "question": "¿Cuál es un objetivo clave al organizar la comunicación digital?",
    "options": [
      "Maximizar los costos de producción",
      "Reducir la presencia online",
      "Optimizar visibilidad e interacciones",
      "Usar solo medios tradicionales"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Uno de los principales objetivos es aumentar la visibilidad e interacción de la marca en el entorno digital."
  },
  {
    "id": 864,
    "question": "¿Qué rol deben desempeñar los blogs y podcasts en la estrategia digital?",
    "options": [
      "Actuar como medios de consulta técnica",
      "Ser acciones transmedia dentro del marketing de contenidos",
      "Sustituir a las redes sociales",
      "Ser empleados solo en contextos corporativos formales"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Los blogs y podcasts son herramientas transmedia que refuerzan la estrategia de marketing de contenidos, especialmente al captar usuarios intensivos."
  },
  {
    "id": 865,
    "question": "¿Qué deben entender los responsables de comunicación en el entorno digital?",
    "options": [
      "Cómo desarrollar apps móviles",
      "El funcionamiento de algoritmos publicitarios",
      "El escenario de la comunicación pública y cómo conectar con el público",
      "Las estadísticas globales de navegación"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Los responsables de comunicación deben comprender el entorno comunicativo público y saber adoptar plataformas que conecten con el público."
  },
  {
    "id": 866,
    "question": "¿Qué representa el Test de Turing permanente en la comunicación digital?",
    "options": [
      "La automatización de contenidos",
      "La imposibilidad de distinguir entre humanos y máquinas",
      "La velocidad de la conexión a internet",
      "La fidelidad de los consumidores"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El Test de Turing permanente alude a la integración total entre humanos y tecnología en un mundo hiperconectado."
  },
  {
    "id": 867,
    "question": "¿Qué tipo de organizaciones sobreviven en el entorno digital?",
    "options": [
      "Las que reducen gastos al mínimo",
      "Las que evitan innovar",
      "Las que aprenden, innovan rápido y transforman su cultura",
      "Las que se centran exclusivamente en productos físicos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "En el entorno digital, las organizaciones que sobreviven son aquellas capaces de aprender, innovar y adaptarse con rapidez."
  },
  {
    "id": 868,
    "question": "¿Qué debe contener un plan de comunicación digital eficaz?",
    "options": [
      "Una lista de contactos de prensa",
      "Una guía de hashtags",
      "Objetivos claros, públicos definidos y un estilo consistente",
      "Contratación de influencers"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El plan de comunicación digital debe establecer objetivos, definir públicos y canales, y mantener coherencia estilística y de mensaje."
  },
  {
    "id": 869,
    "question": "¿Cuál de los siguientes elementos NO forma parte de la articulación on/off?",
    "options": [
      "Diseñar plan editorial",
      "Optimizar SEO y SMO",
      "Reducir el contenido gráfico",
      "Organizar producción para cubrir objetivos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Reducir contenido gráfico no es parte de la estrategia de articulación entre lo físico y lo digital."
  },
  {
    "id": 870,
    "question": "¿Qué se espera del contenido digital, según la guía propuesta?",
    "options": [
      "Que sea breve y promocional",
      "Que se adapte a tendencias pasajeras",
      "Que cumpla objetivos, se encuentre y genere conversación",
      "Que se publique solo en redes sociales"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El contenido debe estar bien producido, con objetivos claros, tiempos adecuados, encontrarse fácilmente y fomentar la conversación."
  },
  {
    "id": 871,
    "question": "¿Qué han olvidado los usuarios al pasar de los blogs a las redes sociales?",
    "options": [
      "Cómo usar hipervínculos",
      "El trabajo que implica mantener el valor de un contenido",
      "El uso de emojis",
      "Cómo monetizar publicaciones"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Los blogs enseñaron que mantener contenido con valor implica esfuerzo, algo que se ha descuidado con las redes sociales."
  },
  {
    "id": 872,
    "question": "¿Qué tipo de estrategia digital es más efectiva en ambientes conversacionales?",
    "options": [
      "Vending",
      "Branding",
      "Spam dirigido",
      "Publicidad invasiva"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "En entornos conversacionales, el branding (marca basada en valores y relación) resulta más efectivo que el vending (venta directa)."
  },
  {
    "id": 873,
    "question": "¿Qué pilar de la estrategia digital permite fidelizar al usuario?",
    "options": [
      "Contenido",
      "Conversación",
      "Comunidad",
      "Comercio"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La comunidad se forma y se mantiene a través de conversaciones constantes, generando fidelidad del usuario."
  },
  {
    "id": 874,
    "question": "¿Cómo se considera un blog corporativo dentro de una estrategia digital?",
    "options": [
      "Una herramienta pasada de moda",
      "Una fuente de datos internos",
      "Una acción transmedia clave",
      "Un canal informativo estático"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El blog corporativo es una acción transmedia que articula contenidos como newsletters, podcasts y publicaciones."
  },
  {
    "id": 875,
    "question": "¿Qué exige la virtualización de procesos dentro de la cadena de valor?",
    "options": [
      "Reducción de la plantilla",
      "Crear comunidad ad hoc e instantánea",
      "Digitalizar solo el área de ventas",
      "Evitar el contacto con los medios"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La virtualización de la cadena de valor conlleva generar comunidades ad hoc, adaptadas a cada necesidad y momento."
  },
  {
    "id": 876,
    "question": "¿Qué rol cumplen las redes sociales en la RSC?",
    "options": [
      "Permitir hacer promociones",
      "Actuar como canales para compartir responsabilidad social corporativa",
      "Difundir rumores de competencia",
      "Aumentar el tráfico sin contenido"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Las redes sociales permiten comunicar y difundir acciones de responsabilidad social corporativa de manera directa."
  },
  {
    "id": 877,
    "question": "¿Qué se busca lograr con un evento en streaming?",
    "options": [
      "Reducir la interacción con el público",
      "Imitar una rueda de prensa con difusión masiva",
      "Limitar el acceso solo a invitados",
      "Evitar la improvisación"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "El streaming permite replicar el impacto de una rueda de prensa incluso con poca asistencia presencial."
  },
  {
    "id": 878,
    "question": "¿Qué se debe tener en cuenta para planificar un evento digital?",
    "options": [
      "Duración limitada a 10 minutos",
      "Estética minimalista",
      "Expectativas del evento: serie, ámbito, ponentes, audiencia y costos",
      "Número de hashtags utilizados"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Un evento digital debe planificarse considerando múltiples factores: objetivos, tipo de público, ponentes y presupuesto."
  },
  {
    "id": 879,
    "question": "¿Qué es clave en la gestión de crisis durante un evento digital?",
    "options": [
      "Programar publicaciones automáticas",
      "Identificar fallos y tener un programa flexible",
      "Eliminar comentarios negativos",
      "Evitar toda participación del público"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Es esencial anticipar problemas, identificar fallos y mantener un programa adaptable ante imprevistos."
  },
  {
    "id": 880,
    "question": "¿Qué acción se recomienda tras un evento digital?",
    "options": [
      "Desactivar cuentas sociales",
      "Publicar fotos y difundir conclusiones",
      "Ocultar los errores técnicos",
      "Reducir la visibilidad online"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Es recomendable compartir imágenes y conclusiones para cerrar la narrativa del evento y ampliar su impacto."
  },
  {
    "id": 881,
    "question": "¿Qué caracteriza a las comunidades ad hoc digitales?",
    "options": [
      "Duración permanente",
      "Estructura corporativa formal",
      "Naturaleza instantánea y contextual",
      "Requieren validación legal"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Las comunidades ad hoc son temporales y surgen en función de necesidades específicas en tiempo real."
  },
  {
    "id": 882,
    "question": "¿Qué relación debe tener el contenido digital con el mundo físico?",
    "options": [
      "Ninguna, deben mantenerse separados",
      "Total dependencia del contenido impreso",
      "Una articulación coherente on/off",
      "Competencia directa con eventos físicos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "La estrategia digital debe articular el entorno online con acciones físicas, logrando una experiencia integrada."
  },
  {
    "id": 883,
    "question": "¿Cuál es uno de los objetivos del SEO y SMO?",
    "options": [
      "Reducir la calidad del contenido",
      "Maximizar el número de seguidores comprados",
      "Optimizar la visibilidad e interacciones",
      "Eliminar la competencia online"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Tanto SEO como SMO buscan aumentar la visibilidad del contenido y fomentar interacciones orgánicas."
  },
  {
    "id": 884,
    "question": "¿Quiénes son los prescriptores en la estrategia digital?",
    "options": [
      "Usuarios con opiniones influyentes",
      "Clientes inactivos",
      "Técnicos de soporte",
      "Personas sin redes sociales"
    ],
    "correctAnswer": 0,
    "subject": "transmedia",
    "topic": "lecture2",
    "explanation": "Los prescriptores son usuarios influyentes cuyas opiniones pueden afectar positivamente la percepción pública."
  },
  {
    "id": 885,
    "question": "¿Qué evento marcó el primer conflicto del entorno digital según Carlos Scolari?",
    "options": [
      "El juicio entre Apple y Microsoft",
      "El lanzamiento del primer iPhone",
      "El anuncio de Apple durante el Super Bowl de 1984",
      "La fundación de Google"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Scolari identifica el anuncio del Macintosh de Apple en el Super Bowl de 1984 como el inicio del conflicto entre visiones digitales distintas."
  },
  {
    "id": 886,
    "question": "¿Cuál era la propuesta principal de Apple frente a Microsoft en los años 80?",
    "options": [
      "Software gratuito",
      "Diseño y enfoque familiar",
      "Mayor potencia de procesamiento",
      "Compatibilidad con Linux"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Apple se posicionaba como una marca 'family friendly' con especial atención al diseño, frente al enfoque laboral de Microsoft."
  },
  {
    "id": 887,
    "question": "¿Qué empresa fue acusada por Apple de copiar su interfaz gráfica?",
    "options": [
      "IBM",
      "Netscape",
      "Microsoft",
      "Xerox"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Apple denunció a Microsoft por copiar su interfaz gráfica, pero el juez dictaminó que Xerox la había comercializado antes."
  },
  {
    "id": 888,
    "question": "¿Quién creó la primera página web y en qué contexto?",
    "options": [
      "Steve Jobs en Apple",
      "Bill Gates en Microsoft",
      "Marc Andreessen en Netscape",
      "Tim Berners-Lee en CERN"
    ],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Tim Berners-Lee creó la primera página web mientras trabajaba en el CERN en 1991, desarrollando un sistema hipertextual para compartir información científica."
  },
  {
    "id": 889,
    "question": "¿Cuál fue el primer navegador web ampliamente utilizado?",
    "options": [
      "Internet Explorer",
      "Chrome",
      "Mosaic",
      "Firefox"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Mosaic, desarrollado por NCSA, fue uno de los primeros navegadores ampliamente adoptados."
  },
  {
    "id": 890,
    "question": "¿Qué empresa fundó Marc Andreessen tras desarrollar Mosaic?",
    "options": [
      "Mozilla",
      "Facebook",
      "Netscape",
      "Spyglass"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Marc Andreessen fundó Netscape en 1994 junto a Jim Clark, ofreciendo un navegador gratuito."
  },
  {
    "id": 891,
    "question": "¿Qué navegador integró Microsoft a todos sus ordenadores Windows?",
    "options": [
      "Chrome",
      "Netscape",
      "Opera",
      "Internet Explorer"
    ],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Microsoft adquirió el software Spyglass y lo convirtió en Internet Explorer, incluyéndolo en todos los sistemas Windows."
  },
  {
    "id": 892,
    "question": "¿Qué compañía adquirió Netscape en 1998?",
    "options": [
      "Google",
      "Facebook",
      "America Online (AOL)",
      "Microsoft"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Netscape fue comprada por America Online en 1998, marcando el fin de su competencia con Microsoft."
  },
  {
    "id": 893,
    "question": "¿Cuál fue una consecuencia de la crisis de las punto-com?",
    "options": [
      "El nacimiento de Facebook",
      "El cierre de Google",
      "La caída de Netscape",
      "La necesidad de retorno rápido de inversión"
    ],
    "correctAnswer": 3,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Durante la crisis de las punto-com, los inversores presionaban para obtener retornos rápidos en startups tecnológicas."
  },
  {
    "id": 894,
    "question": "¿Qué herramienta publicitaria creó Google en el año 2000?",
    "options": [
      "Chrome",
      "Google Ads",
      "AdWords",
      "Gmail"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Google creó AdWords en 2000 como una herramienta para generar ingresos a través de anuncios."
  },
  {
    "id": 895,
    "question": "¿Cuál es la lógica de funcionamiento de Google según Scolari?",
    "options": [
      "Retener a los usuarios en su plataforma",
      "Controlar redes sociales",
      "Redirigir al usuario hacia diversos sitios web",
      "Producir contenido original"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Scolari describe la lógica de Google como centrífuga: el buscador nos lleva hacia los confines de la web."
  },
  {
    "id": 896,
    "question": "¿Qué busca hacer Facebook con sus usuarios, según Scolari?",
    "options": [
      "Dirigirlos a otras webs",
      "Mantenerlos en su ecosistema",
      "Ofrecer búsquedas eficientes",
      "Bloquear el acceso a medios tradicionales"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Facebook opera bajo una lógica centrípeta: busca que el usuario permanezca en su entorno el mayor tiempo posible."
  },
  {
    "id": 897,
    "question": "¿Cómo respondió Facebook a las acusaciones por las 'fake news'?",
    "options": [
      "Aceptando su rol como medio",
      "Culpando a los usuarios",
      "Diciendo que es una empresa tecnológica, no mediática",
      "Censurando todos los contenidos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Facebook afirmó que no era una empresa mediática, sino tecnológica, y que no era responsable del uso de su plataforma."
  },
  {
    "id": 898,
    "question": "¿Qué es el Metaverso según la perspectiva de rebranding empresarial?",
    "options": [
      "Una nueva red social",
      "Un sistema de pago digital",
      "Una interfaz inmersiva y transparente",
      "Un buscador descentralizado"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "El Metaverso es presentado como una interfaz inmersiva y transparente, parte de un proceso de rebranding empresarial."
  },
  {
    "id": 899,
    "question": "¿Qué rol cumplía la homepage durante la era de Netscape?",
    "options": [
      "Era irrelevante",
      "Era donde se vendían productos",
      "Funcionaba como puerta de entrada al contenido web",
      "Permitía enviar correos electrónicos"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "La homepage servía como puerta de entrada a la navegación web y era codiciada por las empresas para colocar banners publicitarios."
  },
  {
    "id": 900,
    "question": "¿Qué motivó a Microsoft a desarrollar Internet Explorer?",
    "options": [
      "El deseo de innovar",
      "Su competencia con IBM",
      "No llegar a tiempo para comprar Netscape",
      "Presión de los usuarios"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Microsoft no logró adquirir Netscape y como reacción compró Spyglass, creando Internet Explorer."
  },
  {
    "id": 901,
    "question": "¿Qué empresa ofrecía un software gratuito para navegar en 1994?",
    "options": [
      "Spyglass",
      "Netscape",
      "Microsoft",
      "Opera"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Netscape, creada por Andreessen y Clark, ofrecía su navegador de forma gratuita en 1994."
  },
  {
    "id": 902,
    "question": "¿Cómo respondió la justicia a la denuncia de Apple contra Microsoft por copiar la interfaz gráfica?",
    "options": [
      "Dictaminó que era una copia ilegal",
      "Obligó a pagar una multa a Microsoft",
      "Declaró que Xerox la había comercializado antes",
      "Prohibió usar interfaces gráficas similares"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "El juez determinó que la interfaz gráfica ya había sido comercializada por Xerox, por lo tanto, no había copia."
  },
  {
    "id": 903,
    "question": "¿Qué hecho marcó la estandarización de la navegación en la web?",
    "options": [
      "La compra de Netscape por Microsoft",
      "El nacimiento de Google con Chrome",
      "La venta de Apple a IBM",
      "La desaparición del HTML"
    ],
    "correctAnswer": 1,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "La creación de Chrome por Google ayudó a estandarizar la navegación web, mejorando la experiencia del usuario."
  },
  {
    "id": 904,
    "question": "¿Qué característica diferencia a Google de Facebook según Scolari?",
    "options": [
      "Google controla redes sociales",
      "Facebook dirige tráfico a otros sitios",
      "Google sigue una lógica de dispersión; Facebook de concentración",
      "Ambos usan exactamente el mismo modelo de negocio"
    ],
    "correctAnswer": 2,
    "subject": "transmedia",
    "topic": "lecture3",
    "explanation": "Scolari afirma que Google funciona con una lógica centrífuga y Facebook con una lógica centrípeta."
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
    "Final 1": "Final 1 202X",
    "Final 2": "Final 2 202X",
    "Final 3": "Final 3 202X",
  },
  transmedia: 
  {
    "1.0": "Tema 1.0",
    "2.0": "Tema 2.0",
    "3.0": "Tema 3.0",
    "4.0": "Tema 4.0",
    "dates": "Fechas",
    "lecture1": "Lectura 1. Hipertexto",
    "lecture2": "Lectura 2. Estrategia",
    "lecture3": "Lectura 3. Web Scolari",
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
  const [penaltyEnabled, setPenaltyEnabled] = useState(false);
  const [penaltyValue, setPenaltyValue] = useState(0.111);
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

                      {/* Add your new penalty toggle button here */}
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                  
                        <Checkbox
                          id="penalty-toggle"
                          checked={penaltyEnabled}
                          onCheckedChange={(checked) => setPenaltyEnabled(checked as boolean)}
                          className="border-2"
                        />
                        <label
                          htmlFor="penalty-toggle"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                        >
                          Subtract points from your final score for every question you fail
                        </label>
                      </div>
                      {penaltyEnabled && (
                        <div className="mt-2 ml-8">
                          <label className="text-xs text-gray-700 dark:text-gray-300 mr-2">
                            Penalty per missed question:
                          </label>
                          <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={penaltyValue}
                            onChange={e => setPenaltyValue(Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            (will be subtracted from your final score)
                          </span>
                          </div>
                    )}  

                    {filteredQuestions.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                          <strong>{filteredQuestions.length}</strong> questions available for practice (randomized)
                        </p>
                      </div>
                    )}
                    </div>
                  </CardContent>
                  <CardContent className="p-6">
                    

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
const penalty = penaltyEnabled ? missedQuestions.length * penaltyValue : 0
const finalScore = Math.max(0, ((score / filteredQuestions.length) * 10) - penalty)

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
