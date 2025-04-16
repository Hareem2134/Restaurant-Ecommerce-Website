// src/lib/renderInvoiceHtml.ts
import ReactDOMServer from 'react-dom/server';
import InvoiceComponent from '../../components/InvoiceTemplate';
import { OrderDetails } from '@/types/orderTypes';
import React from 'react';

export function renderInvoiceToHtml(order: OrderDetails): string {
    console.log("Rendering InvoiceComponent to HTML string...");
    try {
        const html = ReactDOMServer.renderToStaticMarkup(
            React.createElement(InvoiceComponent, { order: order })
        );
        console.log("HTML rendering successful.");
        return html;
    } catch (renderError) {
         console.error("Error rendering InvoiceComponent to HTML:", renderError);
         throw new Error("Failed to render invoice HTML.");
    }
}