package mum.cs472;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
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
        Word result = new Word(word);

        query("SELECT wordtype, definition FROM entries WHERE word = ?",
                stmt -> stmt.setString(1, word.toLowerCase()),
                rs -> {
                    while (rs.next()) {
                        result.addDifition(rs.getString("wordtype"),
                                rs.getString("definition"));
                    }
                });

        return result;
    }
    
    public List<String> getPartialMatch(String word) {
        List<String> matches = new ArrayList<>();

        query("SELECT DISTINCT word FROM entries where word LIKE ? ORDER BY word ASC LIMIT 7",
                stmt -> stmt.setString(1, word.toLowerCase() + "%"),
                rs -> {
                    while (rs.next()) {
                        matches.add(rs.getString("word"));
                    }
                });

        return matches;
    }
    
    private void query(String query, 
            SqlConusmer<PreparedStatement> setStament, 
            SqlConusmer<ResultSet> result) {
        
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            stmt = conn.prepareStatement(query);
            setStament.accept(stmt);
            rs = stmt.executeQuery();
            result.accept(rs);
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
    }
    
    private static interface SqlConusmer <T> {
        void accept(T t) throws SQLException;
    }
}
