import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Change this if your backend lives elsewhere
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function PrinciplesApp() {
  const [principles, setPrinciples] = useState([]);
  const [newPrinciple, setNewPrinciple] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Helpers --------------------------------------------------
  const fetchPrinciples = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/principles`);
      const data = await res.json();
      setPrinciples(data);
    } catch (err) {
      // eslint‑disable‑next‑line no-console
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrinciples();
  }, []);

  const addPrinciple = async () => {
    if (!newPrinciple.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/principles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newPrinciple }),
      });
      if (res.ok) {
        setNewPrinciple("");
        fetchPrinciples();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/principles/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderList = (list) =>
    list.map((p) => (
      <motion.li
        key={p.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-2"
      >
        {p.text}
      </motion.li>
    ));

  // --- UI -------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">My Principles</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Principle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Embrace reality and deal with it"
              value={newPrinciple}
              onChange={(e) => setNewPrinciple(e.target.value)}
            />
            <Button onClick={addPrinciple}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Semantic Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={search} className="flex gap-2">
            <Input
              placeholder="Search principles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Button>
          </form>
          {results.length > 0 && (
            <ul className="mt-4 space-y-2">{renderList(results)}</ul>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-2">All Principles</h2>
      <ul>{renderList(principles)}</ul>
    </div>
  );
}
