// src/utils/styledUtils.js
import { css } from 'styled-components';

// Система утилит для отступов
export const spacing = (props) => {
  const { m, mx, my, mt, mr, mb, ml, p, px, py, pt, pr, pb, pl } = props;
  
  return css`
    ${m && `margin: ${props.theme.getSpacing(m)};`}
    ${mx && `margin-left: ${props.theme.getSpacing(mx)}; margin-right: ${props.theme.getSpacing(mx)};`}
    ${my && `margin-top: ${props.theme.getSpacing(my)}; margin-bottom: ${props.theme.getSpacing(my)};`}
    ${mt && `margin-top: ${props.theme.getSpacing(mt)};`}
    ${mr && `margin-right: ${props.theme.getSpacing(mr)};`}
    ${mb && `margin-bottom: ${props.theme.getSpacing(mb)};`}
    ${ml && `margin-left: ${props.theme.getSpacing(ml)};`}
    
    ${p && `padding: ${props.theme.getSpacing(p)};`}
    ${px && `padding-left: ${props.theme.getSpacing(px)}; padding-right: ${props.theme.getSpacing(px)};`}
    ${py && `padding-top: ${props.theme.getSpacing(py)}; padding-bottom: ${props.theme.getSpacing(py)};`}
    ${pt && `padding-top: ${props.theme.getSpacing(pt)};`}
    ${pr && `padding-right: ${props.theme.getSpacing(pr)};`}
    ${pb && `padding-bottom: ${props.theme.getSpacing(pb)};`}
    ${pl && `padding-left: ${props.theme.getSpacing(pl)};`}
  `;
};

// Утилиты для типографики
export const typography = (props) => {
  const { fontSize, fontWeight, textAlign, textTransform, lineHeight } = props;
  
  return css`
    ${fontSize && `font-size: ${props.theme.typography.fontSize[fontSize] || fontSize};`}
    ${fontWeight && `font-weight: ${props.theme.typography.fontWeight[fontWeight] || fontWeight};`}
    ${textAlign && `text-align: ${textAlign};`}
    ${textTransform && `text-transform: ${textTransform};`}
    ${lineHeight && `line-height: ${lineHeight};`}
  `;
};

// Компонент Box с утилитарными пропсами
import styled from 'styled-components';

export const Box = styled.div`
  ${spacing}
  ${typography}
  ${({ display }) => display && `display: ${display};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`}
  ${({ gap }) => gap && `gap: ${props => props.theme.getSpacing(gap)};`}
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}
  ${({ bg }) => bg && `background-color: ${props => props.theme.colors[bg] || bg};`}
  ${({ color }) => color && `color: ${props => props.theme.colors[color] || color};`}
  ${({ borderRadius }) => borderRadius && `border-radius: ${props => props.theme.borderRadius[borderRadius] || borderRadius};`}
`;