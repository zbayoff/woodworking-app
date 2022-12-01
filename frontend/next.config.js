const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  // if (phase === PHASE_DEVELOPMENT_SERVER) {


    return {
      reactStrictMode: true,
      swcMinify: true,
      rewrites: () => {
        return [
          {
            source: "/api/:path*",
            destination: "http://localhost:5000/api/:path*",
          },
        ];
      },
    };

  // } else {
  //   return {}
  // }
};
// { source: '/api/:path*', destination: '/:path*' },

module.exports = nextConfig;
