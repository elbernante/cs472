package mum.cs472;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DbConnection {
    private static final String DATABASE_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/entries?useSSL=false";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";
    
    private Connection conn;
    
    public Connection connect() {
        if (conn == null) {
            try {
                Class.forName(DATABASE_DRIVER);
                conn = DriverManager.getConnection(DB_URL, USERNAME, PASSWORD);
            } catch (ClassNotFoundException | SQLException ex) {
                Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return conn;
    }
    
    public void diconnect() {
        if (conn != null) {
            try {
                conn.close();
                conn = null;
            } catch (SQLException ex) {
                Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public Word getWord(String word) {
        String q = "SELECT wordtype, definition FROM entries WHERE word = ?";
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        word = word.toLowerCase();
        Word result = new Word(word);
        
        try {
            stmt = conn.prepareStatement(q);
            stmt.setString(1, word);
            rs = stmt.executeQuery();
            
            while(rs.next()) {
                result.addDifition(rs.getString("wordtype"), rs.getString("definition"));
            }
            
        } catch (SQLException ex) {
            Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException ex) { /* Ignore errors */ }
        }
        
        return result;
    }
}
