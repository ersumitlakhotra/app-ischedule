import React, { useState, useMemo } from "react";
import {
  Scissors,
  Activity,
  Users,
  BriefcaseBusiness,
  BookOpen,
  Camera,
  Heart,
  MessageCircle,
  Compass,
  Globe,
  Home,
  Truck,
  Star,
  Music,
  CircleHelp,
} from "lucide-react";
import { SearchInput } from "../../controls";
import { updateField } from "../../common";

const categories = [
  {
    group: "Popular",
    title: "Beauty & Wellness",
    subtitle: "Salons, Spas, Life Coaches",
    icon: Scissors,
  },
  {
    group: "Popular",
    title: "Health & Fitness",
    subtitle: "Yoga, Sports, Therapists",
    icon: Activity,
  },
  {
    group: "Business",
    title: "Classes & Events",
    subtitle: "Coaches, Weddings, Event Organisers",
    icon: Users,
  },
  {
    group: "Business",
    title: "Professional Services",
    subtitle: "Accountants, Consultants",
    icon: BriefcaseBusiness,
  },
  {
    group: "Education",
    title: "Education & Tutoring",
    subtitle: "Schools, Tutors",
    icon: BookOpen,
  },
  {
    group: "Creative",
    title: "Photography",
    subtitle: "Photographers, Studios",
    icon: Camera,
  },
  {
    group: "Lifestyle",
    title: "Pet Services",
    subtitle: "Groomers, Trainers",
    icon: Heart,
  },
  {
    group: "Support",
    title: "Counselling",
    subtitle: "Support, Guidance",
    icon: MessageCircle,
  },
  {
    group: "Lifestyle",
    title: "Activities",
    subtitle: "Outdoor, Creative",
    icon: Compass,
  },
  {
    group: "Business",
    title: "Administrative",
    subtitle: "Government, Offices",
    icon: Globe,
  },
  {
    group: "Home",
    title: "Home Services",
    subtitle: "Cleaning, Repairs",
    icon: Home,
  },
  {
    group: "Transport",
    title: "Automobile",
    subtitle: "Transport, Detailing",
    icon: Truck,
  },
  {
    group: "Lifestyle",
    title: "Spiritual",
    subtitle: "Astrology, Readings",
    icon: Star,
  },
  {
    group: "Creative",
    title: "Music & Dance",
    subtitle: "Studios, Classes",
    icon: Music,
  },
  {
    group: "Other",
    title: "Other",
    subtitle: "Don’t see your category",
    icon: CircleHelp,
  },
];

const groups = ["All", ...new Set(categories.map(c => c.group))];

export const CompanyCategories=({setForm}) =>{
  const [selected, setSelected] = useState(0);
  
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
   const headingLabel = 'Service Categories';

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = cat.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(search.toLowerCase());

      const matchesGroup = activeGroup === "All" || cat.group === activeGroup;

      return matchesSearch && matchesGroup;
    });
  }, [search, activeGroup]);

  return (
    <div class={`w-full bg-white rounded-lg p-4 flex flex-col gap-1 `}>
      
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        
 <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Filter and search . . . ' />
               
        <select
          value={activeGroup}
          onChange={(e) => setActiveGroup(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {groups.map((group, i) => (
            <option key={i} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = selected === index;

            return (
              <div
                key={index}
                onClick={() => {setSelected(index); updateField("category",cat.title,setForm)}}
                className={`group cursor-pointer rounded-2xl p-5 bg-white border transition-all duration-300
                  ${
                    isActive
                      ? "border-indigo-400 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition
                      ${
                        isActive
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 h-1 rounded-full transition-all duration-300
                    ${isActive ? "bg-indigo-500 w-full" : "bg-transparent w-0 group-hover:w-1/2 group-hover:bg-gray-300"}`}
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full">No services found.</p>
        )}
      </div>

    </div>
  );
}
