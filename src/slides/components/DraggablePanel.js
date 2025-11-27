// DraggablePanel.js
import React, { useState, useRef, useEffect } from "react";
import { animate } from "animejs";

/**
 * Generic draggable, minimisable window.
 *
 * Parent container must have `position: relative` and a fixed size.
 */
function DraggablePanel({
  title = "Panel",
  width = 360,
  height = 110, // height used for drag boundaries
  initialX = 20,
  initialY = 20,
  dockX = 8,
  dockY = 20,
  initialMinimized = false, // <----- NEW PROP
  children,
}) {
  const panelRef = useRef(null);

  // State: minimized or expanded
  const [isMinimized, setIsMinimized] = useState(initialMinimized);

  // Current position
  const [pos, setPos] = useState(
    initialMinimized
      ? { x: dockX, y: dockY } // start minimized → start at dock
      : { x: initialX, y: initialY }
  );

  const posRef = useRef(pos);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Position to restore to after minimising
  const [storedPos, setStoredPos] = useState({
    x: initialX,
    y: initialY,
  });
  const storedPosRef = useRef(storedPos);
  useEffect(() => {
    storedPosRef.current = storedPos;
  }, [storedPos]);

  // Drag state
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  // ----------------------------------------------------
  // DRAGGING
  // ----------------------------------------------------
  const handleHeaderMouseDown = (e) => {
    e.preventDefault();
    const host = panelRef.current?.parentElement;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const current = posRef.current;

    dragOffsetRef.current = {
      x: e.clientX - rect.left - current.x,
      y: e.clientY - rect.top - current.y,
    };
    draggingRef.current = true;
  };

  useEffect(() => {
    function handleMouseMove(e) {
      const host = panelRef.current?.parentElement;
      if (!draggingRef.current || !host) return;

      const rect = host.getBoundingClientRect();
      let x = e.clientX - rect.left - dragOffsetRef.current.x;
      let y = e.clientY - rect.top - dragOffsetRef.current.y;

      const maxX = rect.width - width;
      const maxY = rect.height - height;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      setPos({ x, y });
    }

    function handleMouseUp() {
      draggingRef.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [width, height]);

  // ----------------------------------------------------
  // MINIMIZE / RESTORE
  // ----------------------------------------------------
  const handleMinimize = (e) => {
    e.stopPropagation();
    if (!panelRef.current) return;

    setStoredPos(posRef.current); // remember current expanded position
    setPos({ x: dockX, y: dockY }); // snap to dock

    requestAnimationFrame(() => {
      animate(panelRef.current, {
        scale: [1, 0.6],
        opacity: [1, 0.9],
        duration: 350,
        easing: "easeInOutQuad",
        complete() {
          const el = panelRef.current;
          if (el) {
            el.style.transform = "";
            el.style.opacity = "";
          }
          setIsMinimized(true);
        },
      });
    });
  };

  const handleRestore = () => {
    const to = storedPosRef.current;
    setPos({ x: to.x, y: to.y });

    requestAnimationFrame(() => {
      animate(panelRef.current, {
        scale: [0.6, 1],
        opacity: [0.9, 1],
        duration: 350,
        easing: "easeInOutQuad",
        complete() {
          const el = panelRef.current;
          if (el) {
            el.style.transform = "";
            el.style.opacity = "";
          }
          setIsMinimized(false);
        },
      });
    });
  };

  // ----------------------------------------------------
  // INITIAL MINIMIZED VISUAL STATE
  // ----------------------------------------------------
  useEffect(() => {
    if (!initialMinimized && panelRef.current) return;
    // Apply minimized look without animation on first mount
    const el = panelRef.current;
    if (el) {
      el.style.transform = "scale(0.6)";
      el.style.opacity = "0.9";
    }
  }, [initialMinimized]);

  // ----------------------------------------------------

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width,
        maxWidth: "90vw",
        zIndex: 15,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        borderRadius: "0.5rem",
        background: "rgba(255,255,255,0.97)",
        border: "1px solid rgba(0,0,0,0.1)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        style={{
          padding: "0.25rem 0.5rem",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, #485fc7, #3273dc)",
          color: "white",
          fontSize: "0.8rem",
          cursor: "move",
        }}
      >
        <span>{title}</span>

        {isMinimized ? (
          <button
            type="button"
            onClick={handleRestore}
            style={{
              border: "none",
              background: "transparent",
              color: "white",
              fontSize: "0.9rem",
              padding: "0 0.2rem",
              cursor: "pointer",
            }}
          >
            ▴
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMinimize}
            style={{
              border: "none",
              background: "transparent",
              color: "white",
              fontSize: "0.9rem",
              padding: "0 0.2rem",
              cursor: "pointer",
            }}
          >
            ▽
          </button>
        )}
      </div>

      {/* Children (only if expanded) */}
      {!isMinimized && (
        <div
          style={{
            padding: "0.45rem 0.6rem",
            background: "white",
            fontSize: "0.8rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default DraggablePanel;
