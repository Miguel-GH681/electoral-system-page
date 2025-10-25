declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "react-icons/fa" {
  import * as React from "react";
  export const FaVoteYea: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "react-icons/fa" {
  import * as React from "react";
  export const FaPlus: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "react-icons/im" {
  import * as React from "react";
  export const ImExit: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "react-icons/bs" {
  import * as React from "react";
  export const BsFillPeopleFill: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "react-icons/gr" {
  import * as React from "react";
  export const GrBook: React.FC<React.SVGProps<SVGSVGElement>>;
}