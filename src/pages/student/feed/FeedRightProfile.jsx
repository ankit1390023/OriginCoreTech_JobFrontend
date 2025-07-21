    
import cover from '../../../assets/cover.png';
import dummyProfile3 from '../../../assets/dummyProfile3.jpg';
import dummyProfile1 from '../../../assets/dummyProfile1.jpg';
import dummyProfile2 from '../../../assets/dummyProfile2.jpg';
import { FaCamera } from 'react-icons/fa6';



const visitors = [
    { name: 'Olivia Rhye', img: dummyProfile1 },
    { name: 'Phoenix Baker', img: dummyProfile2 },
    { name: 'Lana Steiner', img: dummyProfile3 },
    { name: 'Milo Thorne', img: dummyProfile1 },
    { name: 'Olivia Rhye', img: dummyProfile1 },
    { name: 'Lana Steiner', img: dummyProfile3 },
    { name: 'Milo Thorne', img: dummyProfile1 },
    { name: 'Phoenix Baker', img: dummyProfile2 },
];







export default function FeedRightProfile() {
    return (
        <div>
            <div className="bg-white shadow border rounded p-4">
                {/* Cover + Profile */}
                <div className="relative h-20 mb-12">
                    <div className="w-full h-20 rounded-t bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }}></div>
                    <div className="absolute bg-blue-600 border rounded-full flex items-center justify-center w-6 h-6 top-2 right-2">
                        <FaCamera className='text-white w-3 h-3' />
                    </div>
                    <div className="absolute left-2 top-10 w-24 h-24">
                        <img src={dummyProfile3} alt="Profile" className="w-full h-full rounded-full border-4 border-white object-cover" />
                    </div>
                </div>
                {/* Profile Info */}
                <div className="pt-4">
                    <h2 className="text-lg font-bold text-gray-800">Aman Gupta</h2>
                    <p className="text-sm text-gray-500">@amangupta09</p>
                    <p className="text-sm text-gray-700 font-semibold mt-1">Visual Designer</p>
                    <p className="text-sm text-gray-600 mt-2">Hi, I am Aman working as a designer from 3 years. My skills include Adobe Photoshop,...</p>
                    <div className="flex gap-2 mt-4">
                        <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">2,900 followers</button>
                        <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">1,021 following</button>
                    </div>
                </div>
                {/* Dashboard */}
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 border-t pt-4">Your Dashboard</h3>
                    <div className="flex justify-between text-yellow-500 font-bold text-lg mt-2">
                        <div>
                            <p className='text-2xl'>367</p>
                            <p className="text-xs text-gray-500">Views today</p>
                        </div>
                        <div>
                            <p className='text-2xl'>15</p>
                            <p className="text-xs text-gray-500">Post views</p>
                        </div>
                        <div>
                            <p className='text-2xl'>09</p>
                            <p className="text-xs text-gray-500">Search appearance</p>
                        </div>
                    </div>
                    <p className="text-sm text-blue-600 text-center cursor-pointer mt-2">See more</p>
                </div>
                {/* Profile Visitors */}
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 border-t pt-4">Profile Visitors</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {visitors.map((visitor, index) => (
                            <div key={index} className="text-center">
                                <img src={visitor.img} alt={visitor.name} className="mx-auto object-cover w-12 h-12 rounded" />
                                <p className="text-xs text-gray-600 mt-1">{visitor.name}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-blue-600 text-center cursor-pointer mt-2">See more</p>
                </div>
            </div>
        </div>
    )
}