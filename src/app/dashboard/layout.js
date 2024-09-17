import NavBar from "@/components/Home/Navbar";

function layout({children}) {

    return (
        <>
        <NavBar/>
        {children}
        </>
            
    )
}

export default layout
