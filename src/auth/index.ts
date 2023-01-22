import passport from "passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GraphqlLocalStrategy } from "./strategies/local-graphql.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

passport.use(LocalStrategy)
passport.use(JwtStrategy)
passport.use(GraphqlLocalStrategy)