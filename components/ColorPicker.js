import { HexColorPicker } from "react-colorful"
import "react-colorful/dist/index.css"

const presetColors = ["#EC71A1", "#3AB0C7", "#00BB00", "#EAA822", "#FF0000", "#0000FF"]

export default function ColorPicker({ color, onChange }) {
  return (
    <div>
      <HexColorPicker
        color={color}
        onChange={onChange}
      />
      <div className="mt-2 -mx-1 flex flex-wrap justify-center">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            className="w-6 h-6 m-1 rounded cusor-pointer focus:outline-none"
            style={{ background: presetColor }}
            onClick={() => onChange(presetColor)}
          />
        ))}
      </div>
    </div>
  )
}
