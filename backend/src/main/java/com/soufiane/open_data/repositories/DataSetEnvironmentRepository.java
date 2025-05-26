package com.soufiane.open_data.repositories;

import com.soufiane.open_data.entities.DataSetEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DataSetEnvironmentRepository extends JpaRepository<DataSetEnvironment, Long> {
    List<DataSetEnvironment> findByGidAndDeletedFalse(Long gid);
}
