import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './SignaturePad.css';

/**
 * Pointer-events canvas signature capture. Produces a base64 PNG
 * (`data:image/png;base64,...`) matching the exact contract the backend
 * already validates against for e-signatures (see QuoteController@respondPublic
 * in the backend, and the new /contract/sign, /walkthrough/sign,
 * /selection-areas/{id}/confirm endpoints).
 */
export default function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasStroke = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0D0D0D';
  }, []);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasStroke.current = true;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (hasStroke.current) {
      setIsEmpty(false);
      onChange?.(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStroke.current = false;
    setIsEmpty(true);
    onChange?.(null);
  };

  return (
    <div className="signature-pad">
      <canvas
        ref={canvasRef}
        className="signature-pad-canvas"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      {isEmpty && <span className="signature-pad-hint">Sign here</span>}
      <button type="button" className="signature-pad-clear" onClick={clear}>
        <RotateCcw size={13} /> Clear
      </button>
    </div>
  );
}
