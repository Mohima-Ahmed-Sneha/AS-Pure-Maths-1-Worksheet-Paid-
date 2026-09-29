// =====================================================================
//  EDIT THIS FILE TO ADD YOUR GOOGLE DRIVE LINKS
// =====================================================================
//
//  HOW TO USE:
//  1. In Google Drive, right-click the file → Share → Copy link.
//  2. Paste the link between the quotes "" next to the topic below.
//  3. Leave a topic as "" (empty) until you have its file — the button
//     will simply not appear for that topic.
//
//  ALL topics are currently FREE: the link opens directly for everyone,
//  so share those files as "Anyone with the link can view".
//
//  To make a topic PAID again, remove its `free: true` line. The website
//  then checks the visitor's email against the file's share list in
//  Google Drive (share the file with each paying student's Gmail).
//
// =====================================================================

export type TopicLinks = {
  worksheet: string;
  markScheme: string;
  // Set to true for topics that are free (clicking opens Google Drive
  // directly). Paid topics open the purchase page instead.
  free?: boolean;
};

export const chapterLinks: Record<string, Record<string, TopicLinks>> = {
  "Chapter 1": {
    "Simplification": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Rationalization": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Factorisation": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Simultaneous Equation": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },

  "Chapter 2": {
    "Quadratic & Cubic Graphs": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Tangent & Normal": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Inequalities": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Nature of Roots": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Perpendicular Lines": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },

  "Chapter 3": {
    "Translation & Sketching on Curves": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Translation & Sketching on Trigonometric Curves": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },

  "Chapter 4": {
    "Trigonometry": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Circular Measure": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },

  "Chapter 5": {
    "Differentiation": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },

  "Chapter 6": {
    "Basic Integration": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
    "Graphical Integration": {
      free: true,
      worksheet: "",
      markScheme: "",
    },
  },
};

// Look up the links for a topic, returning empty strings if not set yet.
export function getLinks(chapterTitle: string, topic: string): TopicLinks {
  return (
    chapterLinks[chapterTitle]?.[topic] ?? {
      worksheet: "",
      markScheme: "",
      free: false,
    }
  );
}
