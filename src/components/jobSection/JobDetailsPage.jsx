import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaMoneyBillWave } from "react-icons/fa";
import Header from "../shared/Header";

const jobs = [
    {
        id: "1",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        title: "Digital Marketing Executive",
        company: "Uber",
        location: "Mumbai",
        experience: "1-2 years",
        salary: "INR 3,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 92,
        skillsMissing: false,
        description: "Drive digital marketing campaigns, manage social media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34ocial media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34",
    },
    {
        id: "2",
        logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
        title: "UX Designer",
        company: "Total",
        location: "Delhi",
        experience: "1-2 years",
        salary: "INR 6,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 88,
        skillsMissing: false,
        description: "Design user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2",
    },
    {
        id: "3",
        logo: "https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png",
        title: "Web Development",
        company: "GitLab",
        location: "Hybrid",
        experience: "3 years",
        salary: "INR 9,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 63,
        skillsMissing: true,
        description: "DeDesign user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2velop and maintain scalable web applications. Collaborate with global teams and contribute to open-source projects.",
    },
    {
        id: "4",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Paypal_2014_logo.png",
        title: "Graphic Designer",
        company: "PayPal",
        location: "Mumbai",
        experience: "1-2 years",
        salary: "INR 4,50,000",
        hiring: true,
        weeksAgo: 2,
        match: 58,
        skillsMissing: true,
        description: "Create compelling graphics for digital and print media. Work with marketing teams to deliver creative assets for caDesign user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2mpaigns.",
    },
    {
        id: "1",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        title: "Digital Marketing Executive",
        company: "Uber",
        location: "Mumbai",
        experience: "1-2 years",
        salary: "INR 3,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 92,
        skillsMissing: false,
        description: "Drive digital marketing campaigns, manage social media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34ocial media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34",
    },
    {
        id: "2",
        logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
        title: "UX Designer",
        company: "Total",
        location: "Delhi",
        experience: "1-2 years",
        salary: "INR 6,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 88,
        skillsMissing: false,
        description: "Design user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2",
    },
    {
        id: "3",
        logo: "https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png",
        title: "Web Development",
        company: "GitLab",
        location: "Hybrid",
        experience: "3 years",
        salary: "INR 9,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 63,
        skillsMissing: true,
        description: "DeDesign user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2velop and maintain scalable web applications. Collaborate with global teams and contribute to open-source projects.",
    },
    {
        id: "4",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Paypal_2014_logo.png",
        title: "Graphic Designer",
        company: "PayPal",
        location: "Mumbai",
        experience: "1-2 years",
        salary: "INR 4,50,000",
        hiring: true,
        weeksAgo: 2,
        match: 58,
        skillsMissing: true,
        description: "Create compelling graphics for digital and print media. Work with marketing teams to deliver creative assets for caDesign user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2mpaigns.",
    },
    {
        id: "1",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        title: "Digital Marketing Executive",
        company: "Uber",
        location: "Mumbai",
        experience: "1-2 years",
        salary: "INR 3,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 92,
        skillsMissing: false,
        description: "Drive digital marketing campaigns, manage social media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34ocial media, and analyze performance metrics for Uber's India operations. Collaborate with cross-functional teams to optimize marketing strategies.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34",
    },
    {
        id: "2",
        logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
        title: "UX Designer",
        company: "Total",
        location: "Delhi",
        experience: "1-2 years",
        salary: "INR 6,00,000",
        hiring: true,
        weeksAgo: 2,
        match: 88,
        skillsMissing: false,
        description: "Design user interfaces and experiences for web and mobile applications. Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem34 lorewm2Design user interfaces and experiences for web and mobile applications.Work closely with product managers and developers to deliver intuitive solutions.lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam, quos.lorem34 lorewm2",
    },

];

export default function JobDetailsPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(jobId || jobs[0].id);
    const selectedJob = jobs.find((job) => job.id === selectedId) || jobs[0];

    const handleSelect = (id) => {
        setSelectedId(id);
        navigate(`/jobs/${id}`);
    };

    return (
        <div className="bg-[#f5f6f7] min-h-[180vh]">
            <Header />
            <div className="max-w-8xl mx-auto pt-14 pb-10 ml-10 mr-10 md:px-0 grid grid-cols-1 grid-cols-[460px_6fr] gap-6">
                {/* Left: Job List */}
                <aside className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col self-start min-h-[140vh] p-6">
                    <p className="text-gray-500 text-sm mb-4">Top Jobs Picks for you</p>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[140vh] border border-gray-100 rounded-lg p-2">
                        <div className="flex flex-col gap-4">
                            {jobs.map((job) => (
                                <button
                                    key={job.id}
                                    onClick={() => handleSelect(job.id)}
                                    className={`flex items-center gap-4 rounded-xl px-4 py-4 text-left transition border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:outline-none relative ${selectedId === job.id ? 'bg-blue-100 border-blue-400' : ''}`}
                                >
                                    <img src={job.logo} alt="logo" className="w-16 h-16 rounded-lg object-contain bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-base truncate mb-1">{job.title}</div>
                                        <div className="text-gray-500 text-sm truncate mb-2">{job.company}</div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-2 py-1 border border-gray-200">{job.weeksAgo} weeks ago</span>
                                            <span className={`text-xs rounded-full px-2 py-1 font-semibold ${job.match >= 85 ? 'bg-green-100 text-green-600 border border-green-200' : job.match >= 60 ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' : 'bg-orange-100 text-orange-600 border border-orange-200'}`}>{job.match}% match</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
                {/* Right: Job Details */}
                <main className="bg-white rounded-2xl shadow border border-gray-100 p-8 min-h-[120vh] flex flex-col relative">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={selectedJob.logo} alt="logo" className="w-24 h-24 rounded-lg object-contain bg-gray-100 border border-gray-200" />
                        <div>
                            <div className="font-bold text-2xl leading-tight">{selectedJob.title}</div>
                            <div className="text-gray-500 text-base">{selectedJob.company}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-purple-100 rounded-full px-3 py-1 text-xs text-purple-700 border border-purple-200 flex items-center gap-1"><FaMapMarkerAlt className="text-purple-500 text-xs" />{selectedJob.location}</span>
                                <span className="bg-orange-100 rounded-full px-3 py-1 text-xs text-orange-700 border border-orange-200 flex items-center gap-1"><FaUserTie className="text-orange-500 text-xs" />{selectedJob.experience}</span>
                                <span className="bg-emerald-100 rounded-full px-3 py-1 text-xs text-emerald-700 border border-emerald-200 flex items-center gap-1"><FaMoneyBillWave className="text-emerald-500 text-xs" />{selectedJob.salary}</span>
                                <span className="bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-700 border border-blue-200">Posted: {selectedJob.weeksAgo} weeks ago</span>
                                <span className="bg-teal-100 rounded-full px-3 py-1 text-xs text-teal-700 border border-teal-200">24 applicants</span>

                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 my-6"></div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                        <p className="text-gray-700 text-base leading-relaxed">{selectedJob.description}</p>
                    </div>

                    {/* Apply Now Button - Fixed at bottom right */}
                    <div className="absolute bottom-6 right-6">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
                            onClick={() => {
                                // Handle apply functionality here
                                console.log('Applying for job:', selectedJob.id);
                            }}
                        >
                            Apply Now
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
} 