package com.soufiane.open_data.configs;

import com.soufiane.open_data.services.JwtService;
import com.soufiane.open_data.services.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ApplicationContext context;

    @Autowired
    public JwtFilter(JwtService jwtService, ApplicationContext context) {
        this.jwtService = jwtService;
        this.context = context;
    }

    private static final Map<String, List<String>> PUBLIC_ROUTES = Map.of(
            "/api/login", List.of("*"),
            "/api/register", List.of("*"),
            "/api/themes", List.of("GET"),
            "/api/data-provider/organisations", List.of("GET"),
            "/api/data-provider/organisation-members", List.of("GET"),
            "/api/datasets", List.of("GET")
    );


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        return PUBLIC_ROUTES.entrySet().stream()
                .anyMatch(entry -> path.startsWith(entry.getKey())
                        && (entry.getValue().contains(method) || entry.getValue().contains("*")));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // Token absent ou mal formé → rejeter la requête
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Token missing or invalid");
                return; // stop la chaîne de filtres
            }

            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            if (email == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Invalid token");
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = context.getBean(MyUserDetailsService.class)
                        .loadUserByUsername(email);

                if (!jwtService.validateToken(token, userDetails)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Unauthorized: Token validation failed");
                    return;
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            // Si tout est OK, continue la chaîne
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
        }
    }



}
