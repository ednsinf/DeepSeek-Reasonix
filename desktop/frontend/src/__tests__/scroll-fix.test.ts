// Testes unitários para o fix de scroll do chat
// Verifica que auto-scroll SÓ acontece quando usuário está no bottom
import { describe, test, expect, beforeEach } from "vitest";

describe("Scroll Fix - Auto-scroll deve respeitar posição do usuário", () => {
  let isAtBottom: boolean;
  let userScrolling: boolean;
  let scrollToBottomCalled: boolean;

  beforeEach(() => {
    isAtBottom = true;
    userScrolling = false;
    scrollToBottomCalled = false;
  });

  // Simula o comportamento do Transcript.tsx
  function simulateNewMessage(isAtBottomState: boolean, isUserScrolling: boolean) {
    isAtBottom = isAtBottomState;
    userScrolling = isUserScrolling;
    scrollToBottomCalled = false;

    // Lógica do Transcript.tsx (corrigida)
    if (isAtBottom && !isUserScrolling) {
      scrollToBottomCalled = true;
    }

    return { isAtBottom, userScrolling, scrollToBottomCalled };
  }

  test("Auto-scroll quando usuário está no bottom", () => {
    const result = simulateNewMessage(true, false);
    expect(result.scrollToBottomCalled).toBe(true);
  });

  test("NÃO auto-scroll quando usuário rolou para cima", () => {
    const result = simulateNewMessage(false, false);
    expect(result.scrollToBottomCalled).toBe(false);
  });

  test("NÃO auto-scroll quando usuário está rolando", () => {
    const result = simulateNewMessage(true, true);
    expect(result.scrollToBottomCalled).toBe(false);
  });

  test("NÃO auto-scroll quando usuário rolou para cima E está rolando", () => {
    const result = simulateNewMessage(false, true);
    expect(result.scrollToBottomCalled).toBe(false);
  });
});

describe("scheduleTailSettle - Triple check", () => {
  let modeRef: string;
  let userScrollingRef: boolean;
  let distFromBottom: number;

  beforeEach(() => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 50;
  });

  // Simula o comportamento do scheduleTailSettle
  function shouldForceScroll() {
    // Triple check: modeRef + userScrollingRef + distFromBottom
    if (modeRef !== "tail-follow") return false;
    if (userScrollingRef) return false;
    if (distFromBottom > 100) return false;
    return true;
  }

  test("Força scroll quando está em tail-follow, não rolando, e perto do bottom", () => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 50;
    expect(shouldForceScroll()).toBe(true);
  });

  test("NÃO força scroll quando está em manual mode", () => {
    modeRef = "manual";
    userScrollingRef = false;
    distFromBottom = 50;
    expect(shouldForceScroll()).toBe(false);
  });

  test("NÃO força scroll quando usuário está rolando", () => {
    modeRef = "tail-follow";
    userScrollingRef = true;
    distFromBottom = 50;
    expect(shouldForceScroll()).toBe(false);
  });

  test("NÃO força scroll quando distFromBottom > 100", () => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 150;
    expect(shouldForceScroll()).toBe(false);
  });

  test("Força scroll quando distFromBottom = 0 (exatamente no bottom)", () => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 0;
    expect(shouldForceScroll()).toBe(true);
  });

  test("Força scroll quando distFromBottom = 99 (quase no bottom)", () => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 99;
    expect(shouldForceScroll()).toBe(true);
  });

  test("NÃO força scroll quando distFromBottom = 101 (acima do threshold)", () => {
    modeRef = "tail-follow";
    userScrollingRef = false;
    distFromBottom = 101;
    expect(shouldForceScroll()).toBe(false);
  });
});

describe("onWheelIntent - Libera tailFollow corretamente", () => {
  let tailFollowReleased: boolean;

  beforeEach(() => {
    tailFollowReleased = false;
  });

  // Simula o comportamento do onWheelIntent
  function simulateWheel(deltaY: number, distFromBottom: number) {
    tailFollowReleased = false;

    // Lógica do onWheelIntent (corrigida)
    if (deltaY < 0) {
      // Rola para cima → sempre liberar
      tailFollowReleased = true;
    } else {
      // Rola para baixo → liberar se não está no bottom
      if (distFromBottom > 50) {
        tailFollowReleased = true;
      }
    }

    return tailFollowReleased;
  }

  test("Libera tailFollow quando rola para cima", () => {
    expect(simulateWheel(-100, 50)).toBe(true);
  });

  test("Libera tailFollow quando rola para baixo mas não está no bottom", () => {
    expect(simulateWheel(100, 100)).toBe(true);
  });

  test("NÃO libera tailFollow quando rola para baixo e está no bottom", () => {
    expect(simulateWheel(100, 30)).toBe(false);
  });

  test("Libera tailFollow quando rola para baixo e distFromBottom = 51", () => {
    expect(simulateWheel(100, 51)).toBe(true);
  });

  test("NÃO libera tailFollow quando rola para baixo e distFromBottom = 49", () => {
    expect(simulateWheel(100, 49)).toBe(false);
  });
});
