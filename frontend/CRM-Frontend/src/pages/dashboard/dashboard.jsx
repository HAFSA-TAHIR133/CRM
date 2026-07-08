import { AppSidebar } from "@/pages/dashboard/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Imports from your specific CRM dashboard content
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Target, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50">
        
        {/* Top Header Navigation Strip */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-[width,height] ease-linear sticky top-0 z-50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900 transition-colors" />
            <Separator
              orientation="vertical"
              className="mx-2 h-4 bg-slate-200"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-slate-500 hover:text-teal-700 font-medium text-xs tracking-wide transition-colors">
                    CRM
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-teal-950 font-semibold text-xs tracking-wide">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Dashboard Content View */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          
          {/* Welcome Dashboard Title Block */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-teal-950">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Real-time snapshot of your pipeline performance metrics.
            </p>
          </div>
          
          {/* Your CRM Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: Total Leads */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Leads
                </CardTitle>
                <div className="flex p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100/80">
                  <Users className="h-4 w-4 stroke-[2.5]" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <div className="text-3xl font-black text-slate-900 tracking-tight">248</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1.5 bg-emerald-50/60 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  <span>+12 from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Pipeline Value */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pipeline Value
                </CardTitle>
                <div className="flex p-2 rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100/80">
                  <DollarSign className="h-4 w-4 stroke-[2.5]" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <div className="text-3xl font-black text-slate-900 tracking-tight">$1.24M</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1.5 bg-emerald-50/60 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  <span>+8.2% from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* CARD 3: Conversion Rate */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Conversion Rate
                </CardTitle>
                <div className="flex p-2 rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100/80">
                  <Target className="h-4 w-4 stroke-[2.5]" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <div className="text-3xl font-black text-slate-900 tracking-tight">64.2%</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1.5 bg-emerald-50/60 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  <span>+2.4% from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* CARD 4: Avg. Deal Cycle */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Avg. Deal Cycle
                </CardTitle>
                <div className="flex p-2 rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100/80">
                  <Clock className="h-4 w-4 stroke-[2.5]" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <div className="text-3xl font-black text-slate-900 tracking-tight">14 Days</div>
                <div className="flex items-center text-[11px] font-semibold text-slate-500 mt-1.5 bg-slate-100/80 w-fit px-2 py-0.5 rounded-md border border-slate-200/40">
                  Steady with last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary row for components, tables, or pipelines logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Blueprint Component Box */}
            <div className="min-h-[340px] rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 flex flex-col items-center justify-center text-center shadow-sm transition-all hover:bg-white">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200/40">
                <Users className="h-5 w-5" />
              </div>
              <p className="font-semibold text-sm text-teal-950">Recent Leads View</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">Component data feed placeholder. Your real-time activity metrics will populate here.</p>
            </div>
            
            {/* Right Blueprint Component Box */}
            <div className="min-h-[340px] rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 flex flex-col items-center justify-center text-center shadow-sm transition-all hover:bg-white">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200/40">
                <Clock className="h-5 w-5" />
              </div>
              <p className="font-semibold text-sm text-teal-950">Upcoming Tasks View</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">Component data feed placeholder. Your schedule events timeline will populate here.</p>
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}