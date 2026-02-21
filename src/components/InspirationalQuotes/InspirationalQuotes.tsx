import React from "react";
import Quote from "inspirational-quotes";

const InspirationalQuotes = () => {
    const quote = Quote.getQuote();
    return (
        <div className="flex flex-col items-center text-primary/50">
            <p>"{quote.text}"</p>
            <span>- {quote.author}</span>
        </div>
    );
};

export default InspirationalQuotes;
