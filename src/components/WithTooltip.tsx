import type { ReactNode } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { Content, Portal, Provider, Root, Trigger, Arrow } from '@radix-ui/react-tooltip';

import { tooltipStrings } from '@/constants/tooltips';

import { useStringGetter } from '@/hooks';

import { Icon, IconName } from '@/components/Icon';

import { layoutMixins } from '@/styles/layoutMixins';
import { popoverMixins } from '@/styles/popoverMixins';

type ElementProps = {
  tooltip?: keyof typeof tooltipStrings;
  tooltipString?: string;
  stringParams?: Record<string, string>;
  withIcon?: boolean;
  children?: ReactNode;
  slotTooltip?: ReactNode;
};

type StyleProps = {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
};

export const WithTooltip = ({
  tooltip,
  tooltipString,
  stringParams,
  withIcon,
  children,
  align,
  side,
  className,
  slotTooltip,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  const getTooltipStrings = tooltip && tooltipStrings[tooltip];
  if (!getTooltipStrings && !tooltipString && !slotTooltip) return <>{children}</>;

  let tooltipTitle;
  let tooltipBody;

  if (getTooltipStrings) {
    const { title, body } = getTooltipStrings({
      stringGetter,
      stringParams,
    });
    tooltipTitle = title;
    tooltipBody = body;
  } else {
    tooltipBody = tooltipString;
  }

  return (
    <Provider>
      <Root delayDuration={300}>
        <Trigger asChild>
          <Styled.Abbr>
            {children}
            {withIcon && <Styled.Icon iconName={IconName.HelpCircle} />}
          </Styled.Abbr>
        </Trigger>

        <Portal>
          <Styled.Content sideOffset={8} side={side} align={align} className={className} asChild>
            {slotTooltip ?? (
              <dl>
                {tooltipTitle && <dt>{tooltipTitle}</dt>}
                {tooltipBody && <dd>{tooltipBody}</dd>}
                <Styled.Arrow />
              </dl>
            )}
          </Styled.Content>
        </Portal>
      </Root>
    </Provider>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Abbr = styled.abbr`
  ${layoutMixins.inlineRow}

  text-decoration: underline dashed 0px;
  text-underline-position: under;
  text-decoration-color: var(--color-text-0);
  text-decoration-skip-ink: all;

  cursor: help;
`;

Styled.Content = styled(Content)`
  --tooltip-backgroundColor: var(--color-layer-4);
  --tooltip-backgroundColor: hsl(
    var(--layer-base-hue),
    var(--layer-base-saturation),
    calc(var(--layer-base-lightness) + 4%),
    0.66
  );

  ${popoverMixins.popover}
  --popover-backgroundColor: var(--tooltip-backgroundColor);
  --popover-textColor: var(--color-text-1);

  ${popoverMixins.popoverAnimation}
  --popover-closed-height: auto;

  max-width: 30ch;
  display: grid;
  align-items: end;
  gap: 0.25rem;
  padding: 0.75em;

  font-size: 0.8125em;

  border-radius: 0.33em;

  dt {
    font: var(--font-small-book);
  }

  dd {
    font: var(--font-mini-book);
  }
`;

Styled.Arrow = styled(Arrow)`
  width: 0.75rem;
  height: 0.375rem;

  polygon {
    fill: var(--tooltip-backgroundColor);
  }
`;

Styled.Icon = styled(Icon)`
  color: var(--color-text-0);
`;