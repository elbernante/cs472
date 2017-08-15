package mum.cs472;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author elbernante
 */
public class DictServlet extends HttpServlet {
    
    private final DbConnection conn = new DbConnection();

    @Override
    public void init() throws ServletException {
        super.init();
        conn.connect();
    }

    @Override
    public void destroy() {
        conn.diconnect();
        super.destroy();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            out.write(conn.getWord(request.getParameter("w")).toJSON());
        }
    }
}
