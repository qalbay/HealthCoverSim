const express = require("express");
const cors = require("cors");
const db = require("./db");
const { calculateQuote } = require("./pricing");
const { validateQuoteInput } = require("./validation");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
    res.json({
        message: "HealthCoverSim backend is running",
    });
});

// Create a new quote
app.post("/api/quotes", (req, res) => {
    const validation = validateQuoteInput(req.body);

    if (!validation.isValid) {
        return res.status(400).json({
            error: "Validation failed",
            errors: validation.errors,
        });
    }

    const quote = validation.cleanedQuote;

    try {
        const statement = db.prepare(`
            INSERT INTO quotes (
                customer_name,
                cover_type,
                applicant1_age,
                applicant1_cover_history,
                applicant2_age,
                applicant2_cover_history,
                hospital_cover,
                extras_cover,
                payment_frequency,
                annual_discount,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = statement.run(
            quote.customer_name,
            quote.cover_type,
            quote.applicant1_age,
            quote.applicant1_cover_history,
            quote.applicant2_age,
            quote.applicant2_cover_history,
            quote.hospital_cover,
            quote.extras_cover,
            quote.payment_frequency,
            quote.annual_discount,
            quote.notes
        );

        const newQuote = db
            .prepare("SELECT * FROM quotes WHERE id = ?")
            .get(result.lastInsertRowid);

        res.status(201).json(newQuote);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create quote",
        });
    }
});

// Get all quotes
app.get("/api/quotes", (req, res) => {
    try {
        const quotes = db
            .prepare("SELECT * FROM quotes ORDER BY id DESC")
            .all();

        res.json(quotes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve quotes",
        });
    }
});

// Get one quote with calculated premium
app.get("/api/quotes/:id", (req, res) => {
    const { id } = req.params;

    try {
        const quote = db
            .prepare("SELECT * FROM quotes WHERE id = ?")
            .get(id);

        if (!quote) {
            return res.status(404).json({
                error: "Quote not found",
            });
        }

        const calculation = calculateQuote(quote);

        res.json({
            quote,
            calculation,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve quote",
        });
    }
});

// Update an existing quote
app.put("/api/quotes/:id", (req, res) => {
    const { id } = req.params;

    const validation = validateQuoteInput(req.body);

    if (!validation.isValid) {
        return res.status(400).json({
            error: "Validation failed",
            errors: validation.errors,
        });
    }

    const quote = validation.cleanedQuote;

    try {
        const existingQuote = db
            .prepare("SELECT * FROM quotes WHERE id = ?")
            .get(id);

        if (!existingQuote) {
            return res.status(404).json({
                error: "Quote not found",
            });
        }

        const statement = db.prepare(`
            UPDATE quotes
            SET
                customer_name = ?,
                cover_type = ?,
                applicant1_age = ?,
                applicant1_cover_history = ?,
                applicant2_age = ?,
                applicant2_cover_history = ?,
                hospital_cover = ?,
                extras_cover = ?,
                payment_frequency = ?,
                annual_discount = ?,
                notes = ?
            WHERE id = ?
        `);

        statement.run(
            quote.customer_name,
            quote.cover_type,
            quote.applicant1_age,
            quote.applicant1_cover_history,
            quote.applicant2_age,
            quote.applicant2_cover_history,
            quote.hospital_cover,
            quote.extras_cover,
            quote.payment_frequency,
            quote.annual_discount,
            quote.notes,
            id
        );

        const updatedQuote = db
            .prepare("SELECT * FROM quotes WHERE id = ?")
            .get(id);

        res.json(updatedQuote);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update quote",
        });
    }
});

// Delete a quote
app.delete("/api/quotes/:id", (req, res) => {
    const { id } = req.params;

    try {
        const result = db
            .prepare("DELETE FROM quotes WHERE id = ?")
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Quote not found",
            });
        }

        res.json({
            message: "Quote deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete quote",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});