import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'DayPatch — Make the rest of today work',description:'A calmer orbit for your student life. Plan realistically, recover when life happens, and keep every commitment in view.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
