export type PixelSelectColor =
  | 'pink'
  | 'green'
  | 'cyan'
  | 'yellow'

export type PixelSelectProps = {
  value: string | number
  onChange: (value: string) => void
  options: (string | number)[]
  disabled?: boolean
  color?: PixelSelectColor
  height?: string
}
