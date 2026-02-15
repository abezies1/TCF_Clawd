"use client";

import { useState } from "react";
import Link from "next/link";
import { flavorQuizQuestions, getQuizRecommendations, RichProduct } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [results, setResults] = useState<RichProduct[] | null>(null);
  const { addItem } = useCart();

  const question = flavorQuizQuestions[currentQuestion];
  const progress = ((currentQuestion) / flavorQuizQuestions.length) * 100;

  async function handleAnswer(traits: string[]) {
    await impactFeedback("LIGHT");
    const newTraits = [...selectedTraits, ...traits];
    setSelectedTraits(newTraits);

    if (currentQuestion < flavorQuizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz complete
      await notificationFeedback();
      const recommendations = getQuizRecommendations(newTraits);
      setResults(recommendations);
    }
  }

  function resetQuiz() {
    setCurrentQuestion(0);
    setSelectedTraits([]);
    setResults(null);
  }

  async function handleAddToCart(product: RichProduct) {
    await impactFeedback("MEDIUM");
    addItem({
      variantId: product.id,
      productId: product.id,
      name: product.name,
      variantTitle: "Default Title",
      price: product.price,
    });
  }

  // Results screen
  if (results) {
    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <h1>Your Chocolate Profile</h1>
          <p className="quiz-results-intro">
            Based on your answers, here are the chocolates we think you&apos;ll love most.
          </p>

          <div className="quiz-profile-tags">
            {Array.from(new Set(selectedTraits)).slice(0, 5).map((trait) => (
              <span key={trait} className="flavor-tag">{trait}</span>
            ))}
          </div>

          <div className="product-grid" style={{ marginTop: 32 }}>
            {results.map((product, i) => (
              <div key={product.id} className="product-card">
                {i === 0 && <div className="match-badge">Top Match</div>}
                <div className="product-image">{"\u{1F36B}"}</div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-desc">{product.description}</div>
                  <div className="product-flavors">
                    {product.tastingNotes.primaryFlavors.slice(0, 3).map((f) => (
                      <span key={f} className="flavor-tag">{f}</span>
                    ))}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <div className="product-actions">
                      <Link href={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                        Details
                      </Link>
                      <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={resetQuiz}>
              Retake Quiz
            </button>
            <Link href="/cart" className="btn btn-primary">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz questions
  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-progress">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="quiz-progress-text">
            Question {currentQuestion + 1} of {flavorQuizQuestions.length}
          </span>
        </div>

        <h1 className="quiz-question">{question.question}</h1>

        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option.value}
              className="quiz-option"
              onClick={() => handleAnswer(option.traits)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
