import { useAppStore } from "@/store/useAppStore";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = useAppStore((state) => state.title);
    const isHome = location.pathname === "/";

    return (
        <header className="sticky top-0 z-50 w-full bg-primary border-b-2 border-secondary px-8 py-4 grid grid-cols-3 items-center">
            <div>
                {!isHome && (
                    <button
                        onClick={() => navigate(-1)}
                        className="font-ui text-sm text-paper/70 hover:text-paper flex items-center gap-2 cursor-pointer bg-transparent border-none transition-colors">
                        <ArrowLeft /> Back
                    </button>
                )}
            </div>

            <button
                onClick={() => navigate("/")}
                className="italic text-2xl text-paper tracking-wide cursor-pointer bg-transparent border-none text-center">
                {title || "DevHacks"}
            </button>

            <div />
        </header>
    );
};

export default Header;
